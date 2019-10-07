var express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const multer = require('multer');


const pool  = mysql.createPool({
    connectionLimit : 100,
    host            : 'grubhubproject.c22vppsjstv3.us-east-2.rds.amazonaws.com',
    user            : 'root',
    password        : 'rootroot',
    database        : 'grubhubproject'
});

const storage = multer.diskStorage({
    destination: 'images/buyer/',
    filename: function(req, file, cb){
        
        let currentUserCookie = JSON.parse(req.cookies.buyerData);
        console.log(req.body)
        
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
                        res.cookie('authCookieb', 'authenticated');
                        res.cookie('userType', 'buyer');
                        res.cookie('userId', 'buyer'+buyer['bid']);
                        res.cookie('buyerData',JSON.stringify(buyer),{encode:String});

                        res.writeHead(200);
                        res.end();
                        console.log("Logged In");
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
                //console.log(buyer);
               
                
            }else{
                console.log("No user with the given bid found.");
                res.end("You are not authenticated or user found.");
            }           
        }           
    });  
})


router.post('/profilePictureUpload',upload.single('buyerProfilePicture'), (req,res) =>{
    //console.log(req.body.tesst);
    res.redirect('http://localhost:3000/buyerHome');
    
})

router.post('/searchItem', (req,res) =>{
    let searchItem = req.body.searchItem;
    
    let query = `SELECT restaurants.rid , restaurants.restaurantName,restaurants.cuisine FROM restaurants INNER JOIN 
    items ON items.rid = restaurants.rid WHERE items.name ='${searchItem}'`;
    pool.query(query, function (queryError, results, fields) {
        if (queryError){
            console.log("Error in first if. Check Backend -> Buyer -> searchItem ")
        }else{
            if(results.length > 0){
                res.writeHead(200);
                res.end(JSON.stringify(results));
                console.log(results)
            }else{
                res.writeHead(202);
                console.log("Items not found");
                res.end("No items found.");
            }           
        }           
    });
})

router.post('/menu', (req,res) => {
    
    if(req.cookies.authCookieb === 'authenticated'){
        let rid = req.body.rid;
        let query = `SELECT * FROM items WHERE rid = '${rid}'`;

        console.log(query);
        
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> buyer -> menu ")
            }else{
                if(results.length > 0){
                    let items = results;
                    res.end(JSON.stringify(items));
                }else{
                    console.log("No items found");
                    res.writeHead(404);
                    res.end("No items found");
                }           
            }           
        });

    }else{
        console.log("Error in second if. Check Backend -> buyer -> menu ");
        res.writeHead(405);
        
    }
});

router.post('/placeOrder',(req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
        let rid = req.body.rid;
        let bid = req.body.bid;
        let quantity = req.body.quantity;
        let total = req.body.total;
        let address = req.body.address;

        let query = `INSERT INTO orders (rid, bid, total, status, address) VALUES ('${rid}','${bid}','${total}','new','${address}')`;
        
        //console.log(query);
        
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> buyer -> placeOrder ");
                res.writeHead(401);
                res.end();
            }else{
                let oid = results.insertId;   
                let items =[]
                for( let item in quantity){
                    let itemArr = [];
                    itemArr.push(oid);
                    itemArr.push(item);
                    itemArr.push(quantity[item]);
                    items.push(itemArr);
                }
                //console.log(items);
                let query = `INSERT INTO orderdetails (oid, itemName, qty) VALUES ?`;
                pool.query(query, [items],function (queryError, results, fields) {
                    if (queryError){
                        console.log("Error in Second if. Check Backend -> buyer -> placeOrder ");
                        res.writeHead(402);
                        res.end();
                    }else{
                        console.log("Order Placed");
                        res.end("Order Placed");
                    }           
                });
            }           
        });

    }else{
        console.log("Error in third if. Check Backend -> buyer -> placeOrder ");
        res.writeHead(403);
        res.end();
        
    }
})

router.post('/getCurrentOrders',(req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
        let bid = req.body.bid;
       // console.log(query);
       let orders = [];
       let orderdetails = [];
       let query = `SELECT orders.oid, restaurantName, itemName, qty, total, status
       FROM( (orders INNER JOIN orderdetails ON orders.oid = orderdetails.oid) INNER JOIN 
       restaurants ON restaurants.rid = orders.rid) WHERE bid = '${bid}' AND status<>'Delivered' AND status <> 'Cancelled' order by orders.oid DESC`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> buyer -> getCurrentOrders ")
            }else{
                if(results.length > 0){
                    let upcomingOrders = [];
                    let orders = results;
                    let oidSet = new Set();
                    for( let order of orders){
                        //console.log(order.oid);
                        oidSet.add(order.oid);
                    }
                    // oidSet.forEach( i =>{
                    //     console.log(i)
                    // })
                    for( let oid of oidSet){
                        
                        let itemList = [];
                        let restaurantName ='';
                        let total ;
                        let status;
                        for( let order of orders){
                            if( order.oid === oid){
                                restaurantName = order.restaurantName;
                                total = order.total;
                                status = order.status;
                                itemList.push({'itemName':order.itemName, 'qty':order.qty})
                            }
                        }
                        
                        upcomingOrders.push(
                            {   'oid' : oid,
                                'itemList' : itemList,
                                'restaurantName' : restaurantName,
                                'status' : status,
                                'total' : total
                            }
                        );
                        
                    }
                    console.log(upcomingOrders);
                    res.end(JSON.stringify(upcomingOrders));
                }else{
                    console.log("No orders found");
                    res.writeHead(404);
                    res.end("No orders found");
                }           
            }           
        });

        
        

    }else{
        console.log("Error in second if. Check Backend -> buyer -> getCurrentOrders ");
        res.writeHead(405);
        res.end("Error in validating authetication");
        
    }
})


router.post('/getPastOrders',(req,res) => {
    if(req.cookies.authCookieb === 'authenticated'||1){
        let bid = req.body.bid;
       // console.log(query);
       let orders = [];
       let orderdetails = [];
       let query = `SELECT orders.oid, restaurantName, itemName, qty, total, status
       FROM( (orders INNER JOIN orderdetails ON orders.oid = orderdetails.oid) INNER JOIN 
       restaurants ON restaurants.rid = orders.rid) WHERE bid = '${bid}' AND (status ='Delivered' OR status = 'Cancelled') order by orders.oid desc`;
        pool.query(query, function (queryError, results, fields) {
            if (queryError){
                console.log("Error in first if. Check Backend -> buyer -> getPastOrders ")
            }else{
                if(results.length > 0){
                    let upcomingOrders = [];
                    let orders = results;
                    let oidSet = new Set();
                    for( let order of orders){
                        //console.log(order.oid);
                        oidSet.add(order.oid);
                    }
                    // oidSet.forEach( i =>{
                    //     console.log(i)
                    // })
                    for( let oid of oidSet){
                        
                        let itemList = [];
                        let restaurantName ='';
                        let total ;
                        let status;
                        for( let order of orders){
                            if( order.oid === oid){
                                restaurantName = order.restaurantName;
                                total = order.total;
                                status = order.status;
                                itemList.push({'itemName':order.itemName, 'qty':order.qty})
                            }
                        }
                        
                        upcomingOrders.push(
                            {   'oid' : oid,
                                'itemList' : itemList,
                                'restaurantName' : restaurantName,
                                'status' : status,
                                'total' : total
                            }
                        );
                        
                    }
                    console.log(upcomingOrders);
                    res.end(JSON.stringify(upcomingOrders));
                }else{
                    console.log("No orders found");
                    res.writeHead(404);
                    res.end("No orders found");
                }           
            }           
        });

        
        

    }else{
        console.log("Error in second if. Check Backend -> buyer -> getPastOrders ");
        res.writeHead(405);
        res.end("Error in validating authetication");
        
    }
})

router.get('/logout',(req,res) =>{
    res.clearCookie('authCookieb');
    res.clearCookie('userType');
    res.clearCookie('userId');
    res.clearCookie('buyerData');
    res.redirect("http://localhost:3000/");
}) 

module.exports = router;