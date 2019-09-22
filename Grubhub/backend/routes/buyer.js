var express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');


let router = express.Router();

const pool  = mysql.createPool({
    connectionLimit : 100,
    host            : 'localhost',
    user            : 'root',
    password        : 'rootroot',
    database        : 'grubhubProject'
});

router.post('/signup', (req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    console.log(password)
    
    bcrypt.hash(password, 10).then(function(hashedPassword){
        res.send(`Email: ${email}, Name: ${name}, Hashed Password: ${hashedPassword}`);
        res.end();
        
        let query = `SELECT * from buyers WHERE email = '${email}'`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                throw queryError;
            }else{
                console.log("Checking if email exists in buyers table.");
                if(results.length == 0 ){
                    console.log("Entering the new details of buyer.");
                    let query = `INSERT INTO buyers (name, email, password) VALUES ('${name}', '${email}','${hashedPassword}')`;
                    pool.query(query, function (queryError, results, fields) {
                        if (queryError){
                            throw queryError;
                        }else{
                            console.log("Data Entered");
                        }    
                    });   
                }else{
                    console.log("Email already exists in the table, buyer data not entered.");
                }
            }      
        });
    });
});


router.post('/signin',(req, res)=> {
    let email = req.body.email;
    let password = req.body.password;
    let query = `SELECT * FROM buyers WHERE email = '${email}'`;
    pool.query(query, function (queryError, results, fields) {
        if (queryError){
            throw queryError;
        }else{
            if(results.length > 0){
                let buyer = results[0];
                let hashedPassword = buyer['password'];
                console.log("Buyer matched, checking for password!");
                bcrypt.compare(password, hashedPassword).then(function(matched) {
                    if(matched){
                        delete buyer.password;
                        res.send(JSON.stringify(buyer));
                        console.log(buyer);
                    }
                    else{
                        res.end("Incorrect Password");
                        console.log("Incorrect Password");
                    }
                    res.end(matched.toString());
                }).catch(decryptionError => console.log(decryptionError));
                
            }else{
                console.log("No user with the given email found.");
                res.end("No user with the given email found.");
            }           
        }           
    });  
})

router.post('/update', (req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let bid = req.body.bid;

    bcrypt.hash(password, 10).then(function(hashedPassword){
        
        let query = `UPDATE buyers SET name = '${name}', email = '${email}',password = '${hashedPassword}',phone = '${phone}' WHERE bid = ${bid};`
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                throw queryError;
            }else{
                console.log(results);
                res.send("Records Updated");
            }   
        }); 
    });
});


module.exports = router;