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

        let query = `SELECT * from restaurants WHERE ownerEmail = '${email}'`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> Owner -> Signup \n ");
                res.writeHead(400);
                res.send("Error");
            }else{
                console.log("Checking if email exists in restaurants table.");
                if(results.length == 0 ){
                    console.log("Entering the new details of owner");
                    let query = `INSERT INTO restaurants (ownerName, ownerEmail, ownerPassword, restaurantName, restaurantZip) VALUES ('${name}', '${email}','${hashedPassword}','${restaurantName}','${restaurantZip}')`;
                    //console.log(query);
                    pool.query(query, function (queryError, results, fields) {
                        if (queryError){
                            console.log("Error in Second if. Check Backend -> Restaurant -> SignUp ");
                            res.writeHead(201);
                            res.end("Error:  Check Backend -> Restaurant -> SignUp (2nd If)");
                        }else{
                            console.log("Signed up");
                            res.writeHead(200);
                            res.end("Signed up sucessfully");
                        }    
                    });   
                }else{
                    console.log("Email already exists in the table, owner data not entered.");
                    res.writeHead(202)
                    res.end("Account Already Exists");
                }
            }           
        });            
    }).catch(passwordHashFailure => console.log(passwordHashFailure));
});


router.post('/signin',(req, res)=> {
    let email = req.body.email;
    let password = req.body.password;
    let query = `SELECT * FROM restaurants WHERE ownerEmail = '${email}'`;
    pool.query(query, function (queryError, results, fields) {
        if (queryError){
            res.writeHead(203);
            res.end();
            console.log("Error in first if. Check Backend -> Restaurant -> Signin ")
        }else{
            if(results.length > 0){
                let owner = results[0];
                let hashedPassword = owner['ownerPassword'];
                console.log("ownerEmail matched, checking for password!");
                bcrypt.compare(password, hashedPassword).then(function(matched) {
                    if(matched){
                        delete owner.ownerPassword;
                        res.cookie('authCookie', 'authenticated');
                        res.cookie('userType', 'owner');
                        res.cookie('userId', 'owner'+owner['rid']);
                        res.cookie('ownerData',JSON.stringify(owner),{encode:String});
                        
                        res.writeHead(200);
                        res.end()
                        console.log("Owner Signed in");
                    }
                    else{
                        res.writeHead(201);
                        res.end("Incorrect Password");
                        console.log("Incorrect Password");
                    }
                
                }).catch(decryptionError => console.log(decryptionError));
                
            }else{
                res.writeHead(202);
                console.log("No user with the given email found.");
                res.end("No user with the given email found.");
            }           
        }           
    });  
})



router.post('/update', (req,res) =>{
    let ownerName = req.body.ownerName;
    let ownerEmail = req.body.ownerEmail;
    let ownerPassword = req.body.ownerPassword;
    let ownerPhone = req.body.ownerPhone;
    let rid = req.body.rid;
    let restaurantName = req.body.restaurantName;
    let restaurantZip = req.body.restaurantZip;
    let cuisine = req.body.cuisine;

    let selfFlag = false;

    let query = `SELECT ownerEmail from restaurants WHERE rid = '${rid}'`;
    pool.query(query, function (queryError, results, fields) {
        if (queryError){
            console.log("Error in first if. Check Backend -> Buyer -> update ");
        }else{
            if(results[0].ownerEmail === ownerEmail){
                selfFlag = true;
            }
            else{
                selfFlaf = false;
            }
        }      
    });

    bcrypt.hash(ownerPassword, 10).then(function(hashedPassword){
        
        let query = `SELECT * from restaurants WHERE ownerEmail = '${ownerEmail}'`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> restaurant -> update ");
                res.writeHead(201);
                res.end("Data not updated, Error in first if. Check Backend -> restaurant -> update.")
            }else{
                console.log("Checking if email exists in restaurants table.");

                if(results.length == 0 || selfFlag){
                    let query = `UPDATE restaurants SET ownerName = '${ownerName}',
                         ownerEmail = '${ownerEmail}', ownerPassword = '${hashedPassword}', ownerPhone = '${ownerPhone}',
                         restaurantName = '${restaurantName}', restaurantZip = ${restaurantZip},cuisine = '${cuisine}'
                         WHERE rid = ${rid}`;
                    pool.query(query, function (queryError, results, fields) {
                        if (queryError){
                            res.writeHead(202);
                            res.end("Error in if 2, Check Backend -> restaurant -> update ")
                            console.log("Error in if 2, Check Backend -> restaurant -> update ")
                        }else{
                            console.log(results);
                            res.writeHead(200);
                            res.end("Records Updated");
                        }   
                    }); 

                }else{
                    console.log("Email already exists in the table, owner data not Updated.");
                    res.writeHead(203);
                    res.end("Email Belongs to another account.");
                }
            }      
        });
    }).catch(error => console.log(error));
});

    // bcrypt.hash(ownerPassword, 10).then(function(hashedPassword){
        
    //     let query = `UPDATE restaurants SET ownerName = '${ownerName}',
    //     ownerEmail = '${ownerEmail}', ownerPassword = '${hashedPassword}', ownerPhone = '${ownerPhone}',
    //     restaurantName = '${restaurantName}', restaurantZip = ${restaurantZip},cuisine = '${cuisine}'
    //     WHERE rid = ${rid}`;

    //     pool.query(query, function (queryError, results, fields) {
    //         if (queryError){
    //             throw queryError;
    //         }else{
    //             console.log(results);
    //             res.send("Records Updated");
    //         }   
    //     }); 
    // }).catch(passwordHashFailure => console.log(passwordHashFailure));

//     res.send(req.body)
// });

router.post('/home',(req, res)=> {

    //console.log(JSON.stringify(req.cookies));
    let rid = req.body.rid;
    //console.log(rid);
    
    let query = `SELECT * FROM restaurants WHERE rid = '${rid}'`;
    pool.query(query, function (queryError, results, fields) {
        if (queryError){
            console.log("Error in first if. Check Backend -> owner -> HOME ")
        }else{
            if(results.length > 0){
                let owner = results[0];
                delete owner.ownerPassword;
                res.send(JSON.stringify(owner));
                console.log(owner);
               
                
            }else{
                console.log("No user with the given rid found.");
                res.end("You are not authenticated or user not found.");
            }           
        }           
    });  
})

router.get('/logout',(req,res) =>{
    res.clearCookie('authCookie');
    res.clearCookie('userType');
    res.clearCookie('userId');
    res.clearCookie('ownerData');
    res.redirect("http://localhost:3000/");
}) 

module.exports = router;