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
    
    bcrypt.hash(password, 10).then(function(hashedPassword){
              
        let query = `SELECT * from buyers WHERE email = '${email}'`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> Buyer -> Signup second");
            }else{
                console.log("Checking if email exists in buyers table.");
                if(results.length == 0 ){
                    console.log("Entering the new details of buyer.");
                    let query = `INSERT INTO buyers (name, email, password) VALUES ('${name}', '${email}','${hashedPassword}')`;
                    pool.query(query, function (queryError, results, fields) {
                        if (queryError){
                            res.send("Error second if. Check Backend -> Buyer -> Signup second ");
                        }else{
                            console.log("Data Entered");
                            res.send("Sucessfully Signed Up!");
                        }    
                    });   
                }else{
                    console.log("Email already exists in the table, buyer data not entered.");
                    res.send("Alredy Registered");
                }
            }      
        });
    });
});


router.post('/signin',(req, res)=> {

    console.log(JSON.stringify(req.cookies));
    let email = req.body.email;
    let password = req.body.password;
    let query = `SELECT * FROM buyers WHERE email = '${email}'`;
    pool.query(query, function (queryError, results, fields) {
        if (queryError){
            console.log("Error in first if. Check Backend -> Buyer -> Signin ")
        }else{
            if(results.length > 0){
                let buyer = results[0];
                let hashedPassword = buyer['password'];
                console.log("Buyer matched, checking for password!");
                bcrypt.compare(password, hashedPassword).then(function(matched) {
                    if(matched){
                        delete buyer.password;
                        res.cookie('authCookie', 'authenticated');
                        res.cookie('userType', 'buyer');
                        res.cookie('userId', 'buyer'+buyer['bid']);
                        res.cookie('buyerData',JSON.stringify(buyer),{encode:String});

                        res.writeHead(200);
                        console.log(buyer);
                    }
                    else{
                        res.writeHead(403);
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

    let selfFlag = false;

    let query = `SELECT email from buyers WHERE bid = '${bid}'`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> Buyer -> update ");
            }else{
                if(results[0].email === email){
                    selfFlag = true;
                }
                else{
                    selfFlaf = false;
                }
            }      
        });

    bcrypt.hash(password, 10).then(function(hashedPassword){
        
        let query = `SELECT * from buyers WHERE email = '${email}'`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> Buyer -> update ");
            }else{
                console.log("Checking if email exists in buyers table.");

                if(results.length == 0 || selfFlag){
                    let query = `UPDATE buyers SET name = '${name}', email = '${email}',password = '${hashedPassword}',phone = '${phone}' WHERE bid = ${bid};`
                    pool.query(query, function (queryError, results, fields) {
                        if (queryError){
                            console.log("Error in if 1, Check Backend -> Buyer -> update ")
                        }else{
                            console.log(results);
                            res.send("Records Updated");
                        }   
                    }); 

                }else{
                    console.log("Email already exists in the table, buyer data not Updated.");
                    res.writeHead("400");
                    res.end("Email Belongs to someone else.");
                }
            }      
        });
    });
});


module.exports = router;