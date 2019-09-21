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
    let restaurantName = req.body.restaurantName;
    let restaurantZip = req.body.restaurantZip;
    
    
    bcrypt.hash(password, 10).then(function(hashedPassword){
        res.send(`Email: ${email}, Name: ${name}, Hashed Password: ${hashedPassword}, Restaurant : ${restaurantName}, ${restaurantZip}`);
        res.end();

        let query = `SELECT * from restaurants WHERE ownerEmail = '${email}'`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                throw queryError;
            }else{
                console.log("Checking if email exists in restaurants table.");
                if(results.length == 0 ){
                    console.log("Entering the new details of owner");
                    let query = `INSERT INTO restaurants (ownerName, ownerEmail, ownerPassword, restaurantName, restaurantZip) VALUES ('${name}', '${email}','${hashedPassword}','${restaurantName}','${restaurantZip}')`;
                    pool.query(query, function (queryError, results, fields) {
                        if (queryError){
                            throw queryError;
                        }else{
                            console.log("Data Entered");
                        }    
                    });   
                }else{
                    console.log("Email already exists in the table, owner data not entered.");
                }
            }
            
            
        });
        
            
    }).catch(passwordHashFailure => console.log(passwordHashFailure));
});


module.exports = router;