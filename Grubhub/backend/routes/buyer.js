var express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const multer = require('multer');


const pool  = mysql.createPool({
    connectionLimit : 100,
    host            : 'localhost',
    user            : 'root',
    password        : 'rootroot',
    database        : 'grubhubProject'
});

const storage = multer.diskStorage({
    destination: 'images/buyer/',
    filename: function(req, file, cb){
        
        let currentUserCookie = JSON.parse(req.cookies.buyerData);
        
        cb(null, JSON.stringify(currentUserCookie.bid)+'.jpg' );
    }
});

const upload = multer({storage:storage});

let router = express.Router();

router.post('/signup', (req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    
    bcrypt.hash(password, 10).then(function(hashedPassword){
              
        let query = `SELECT * from buyers WHERE email = '${email}'`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                res.writeHead(400);
                res.end();
                console.log("Error in first if. Check Backend -> Buyer -> Signup ");
            }else{
                console.log("Checking if email exists in buyers table.");
                if(results.length == 0 ){
                    console.log("Entering the new details of buyer.");
                    let query = `INSERT INTO buyers (name, email, password) VALUES ('${name}', '${email}','${hashedPassword}')`;
                    pool.query(query, function (queryError, results, fields) {
                        if (queryError){
                            res.writeHead(201);
                            res.end("Error second if. Check Backend -> Buyer -> Signup ");
                        }else{
                            console.log("Data Entered");
                            res.writeHead(200);
                            res.end("Sucessfully Signed Up!");
                            
                        }    
                    });   
                }else{
                    console.log("Email already exists in the table, buyer data not entered.");
                    res.writeHead(202);
                    res.end("This account already exists.");
                }
            }      
        });
    });
});


router.post('/signin',(req, res)=> {

    //console.log(JSON.stringify(req.cookies));
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
                        res.end();
                        //console.log(buyer);
                    }
                    else{
                        res.writeHead(201);
                        res.end("Incorrect Password");
                        console.log("Incorrect Password");
                    }
                    res.end(matched.toString());
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
                            console.log("Error in if 2, Check Backend -> Buyer -> update ");
                            res.writeHead(201);
                            res.end("Records not updated, Error in if 2, Check Backend -> Buyer -> update.");
                        }else{
                            //console.log(results);
                            console.log("Profile Updated");
                            res.writeHead(200);
                            res.end("Records Updated");
                        }   
                    }); 

                }else{
                    console.log("Email already exists in the table, buyer data not Updated.");
                    res.writeHead("202");
                    res.end("Email Belongs to someone else.");
                }
            }      
        });
    }).catch(error => console.log(error));;
});

router.post('/home',(req, res)=> {

    //console.log(JSON.stringify(req.cookies));
    let bid = req.body.bid;
    //console.log(bid);
    
    let query = `SELECT * FROM buyers WHERE bid = '${bid}'`;
    pool.query(query, function (queryError, results, fields) {
        if (queryError){
            console.log("Error in first if. Check Backend -> Buyer -> HOME ")
        }else{
            if(results.length > 0){
                let buyer = results[0];
                delete buyer.password;
                res.send(JSON.stringify(buyer));
                console.log(buyer);
               
                
            }else{
                console.log("No user with the given bid found.");
                res.end("You are not authenticated or user found.");
            }           
        }           
    });  
})


router.post('/profilePictureUpload',upload.single('buyerProfilePicture'), (req,res) =>{
    res.redirect('http://localhost:3000/buyerHome');
    
})

router.get('/logout',(req,res) =>{
    res.clearCookie('authCookie');
    res.clearCookie('userType');
    res.clearCookie('userId');
    res.clearCookie('buyerData');
    res.redirect("http://localhost:3000/");
}) 

module.exports = router;