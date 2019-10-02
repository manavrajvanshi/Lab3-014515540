var express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const multer = require('multer');

const ownerStorage = multer.diskStorage({
    destination: 'images/owner/',
    filename: function(req, file, cb){
        
        let currentUserCookie = JSON.parse(req.cookies.ownerData);
        
        cb(null, JSON.stringify(currentUserCookie.rid)+'.jpg' );
    }
});
const ownerUpload = multer({storage:ownerStorage});

const restaurantStorage = multer.diskStorage({
    destination: 'images/restaurant/',
    filename: function(req, file, cb){
        
        let currentUserCookie = JSON.parse(req.cookies.ownerData);
        
        cb(null, JSON.stringify(currentUserCookie.rid)+'.jpg' );
    }
});

const restaurantUpload = multer({storage:restaurantStorage});

const pool  = mysql.createPool({
    connectionLimit : 100,
    host            : 'localhost',
    user            : 'root',
    password        : 'rootroot',
    database        : 'grubhubProject'
});




let router = express.Router();


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
                        res.cookie('rid', owner['rid']);
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
                selfFlag = false;
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
                            console.log(results);/////////////////////////////////////////////////////////
                            
                            //////////////////////////////////////////////////////////////////////////////
                            //res.cookie('ownerData',JSON.stringify(owner),{encode:String});
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
                res.end(JSON.stringify(owner));
                //console.log("HI");
               
                
            }else{
                console.log("No user with the given rid found.");
                res.end("You are not authenticated or user not found.");
            }           
        }           
    });  
})

router.post('/profilePictureUpload',ownerUpload.single('ownerProfilePicture'), (req,res) =>{
    res.redirect('http://localhost:3000/ownerHome');
    
})

router.post('/restaurantPictureUpload',restaurantUpload.single('restaurantPicture'), (req,res) =>{
    res.redirect('http://localhost:3000/ownerHome');
    
})


router.get('/menu', (req,res) => {
    
    if(req.cookies.authCookie === 'authenticated'){
        let ownerData = req.cookies.ownerData;
        let rid = JSON.parse(ownerData).rid;
        let query = `SELECT * FROM items WHERE rid = '${rid}'`;
        
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> restaurant -> menu ")
            }else{
                // console.log(rid);
                // console.log(query);
                // console.log(results);
                if(results.length > 0){
                    let items = results;
                    res.end(JSON.stringify(items));
                }else{
                    console.log("No items stored");
                    console.log(results.length);
                    res.end();
                }           
            }           
        });

    }else{
        console.log("asdfadsf");
        res.writeHead(405);
        
    }
});

router.post('/addItem', (req, res)=>{

    let name = req.body.name;
    let description = req.body.description;
    let price = req.body.price;
    let section = req.body.section;
    let rid = req.body.rid;

    if(req.cookies.authCookie === 'authenticated'){
        let query = `INSERT INTO items (description,price,name,section,rid) VALUES 
        ('${description}',${price},'${name}','${section}',${rid})`;
        
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> restaurant -> addItem ")
            }else{
                res.writeHead(200);
                res.end();
                console.log("Item Added");          
            }           
        });

    }else{
        console.log("Not Authenticated (/addItem)");
        res.writeHead(400);
        
    }
})

router.post('/deleteMenuItem', (req,res) => {
    if( req.cookies.authCookie === 'authenticated'){
        let iid = req.body.iid;
        let query = `DELETE FROM items WHERE iid = '${iid}'`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> restaurant -> deleteMenuItem");
                res.writeHead(500);
                res.end();
            }else{
                res.writeHead(200);
                res.end();
                console.log("Item Deleted");          
            }           
        });
    }
})
router.post('/deleteSection', (req,res) =>{
    if(req.cookies.authCookie === 'authenticated'){
        let rid = req.body.rid;
        let section = req.body.section;
        
        let query = `DELETE FROM items WHERE rid = ${rid} AND section ='${section}'`;
        
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> restaurant -> deleteSection ");
                res.writeHead(400);
                res.end();
            }else{
                res.writeHead(200);
                res.end(JSON.stringify(results));       
            }           
        });
    }else{
        res.redirect('http://localhost:3000/ownerLogin');
    }
})
router.post('/addSection',(req,res) => {
    if(req.cookies.authCookie === 'authenticated'){
        let rid = req.body.rid;
        let sectionName = req.body.sectionName;

        let query = `INSERT INTO sections VALUES ( ${rid}, '${sectionName}')`;
        
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> restaurant -> addSection ");
                res.writeHead(400);
                res.end("Section not added");
            }else{
                res.writeHead(200);
                res.end('Section added sucessfully');       
            }           
        });
    }else{
        res.redirect('http://localhost:3000/ownerLogin');
    }
})

router.get('/logout',(req,res) =>{
    res.clearCookie('authCookie');
    res.clearCookie('userType');
    res.clearCookie('userId');
    res.clearCookie('ownerData');
    res.redirect("http://localhost:3000/");
});

module.exports = router;