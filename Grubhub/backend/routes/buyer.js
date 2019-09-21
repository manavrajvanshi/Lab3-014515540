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


module.exports = router;