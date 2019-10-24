var express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const multer = require('multer');
const mongoose = require('mongoose');
const database = require('../database/database');
const Buyer = database.Buyer;
const Restaurant = database.Restaurant;
const Order = database.Order;
let enVar = require('../enVar.js');
const reactAddress = enVar.reactAddress;

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
        console.log("HEREEEEE");
        console.log(currentUserCookie.bid);
        
        cb(null, currentUserCookie.bid+'.jpg' );
    }
});

const upload = multer({storage:storage});

let router = express.Router();

router.post('/signup', (req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    
    bcrypt.hash(password, 10).then(function(hashedPassword){

        let query = {email : email};
        
        Buyer.find(query, function(err,result){
            if(err){
                console.log("Error in first if. Check Backend -> Buyer -> Signup ");
                res.writeHead(400);
                res.end("Something Happened LOL");
            }else{
                let x = result.length;
                console.log("Checking if email exists in buyers table.");
                if( x == 0){
                    console.log("Entering the new details of buyer.");
                    let buyer = new Buyer({name : name, email : email, password : hashedPassword});
                    buyer.save( function(err, result){
                        if(err){
                            res.writeHead(201);
                            res.end("Error second if. Check Backend -> Buyer -> Signup ");
                        }else{
                            console.log(`${buyer} signed up`);
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
    //console.log("INSIDEEEE");
    //console.log(JSON.stringify(req.cookies));
    let email = req.body.email;
    let password = req.body.password;

    let query = {email : email};

    Buyer.find(query, function(err, result){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> Signin ");
            res.writeHead(400);
            res.end("Error");
        }else{
            if(result.length > 0){
                console.log(result);
                let data = result[0];
                let hashedPassword = data['password'];
                console.log("Buyer matched, checking for password!");
                bcrypt.compare(password, hashedPassword).then(function(matched) {
                    if(matched){
                        let buyer = {
                            bid : data['_id'],
                            name : data['name'],
                            email : data['email'],
                            __v : data['__v'],
                            phone : data['phone']
                        };
                        res.cookie('authCookieb', 'authenticated');
                        res.cookie('userType', 'buyer');
                        res.cookie('userId', 'buyer:'+buyer['bid']);
                        res.cookie('buyerData',JSON.stringify(buyer),{encode:String});
                        res.writeHead(200);
                        res.end("Logged In");
                        console.log("Logged In");
                    }else{
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
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let bid = req.body.bid;
    let selfFlag = false;
    let query = {_id:bid};
    Buyer.find(query, function (err,result){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> update ");
        }else{
            
            if(result.length > 0 ){
                if( result[0].email === email){
                    selfFlag = true;
                }else{
                    selfFlag = false;
                }
            }else{
                selfFlag = false;
            }
        }
    });
    bcrypt.hash(password, 10).then(function(hashedPassword){
        let query = {email:email};
        Buyer.find(query, function (err, result){
            if(err){
                console.log("Error in first if. Check Backend -> Buyer -> update ");
            }else{
                console.log("Checking if email exists in buyers table.");

                if(result.length == 0 || selfFlag){
                    let query = {_id:bid};
                    let buyer = {name:name, email:email, password:hashedPassword, phone:phone};
                    Buyer.findOneAndUpdate(query, buyer, {new : true}, function(err,result){
                        if(err){
                            console.log("Error in if 2, Check Backend -> Buyer -> update ");
                            res.writeHead(201);
                            res.end("Records not updated, Error in if 2, Check Backend -> Buyer -> update.");
                        }else{
                            console.log("Profile Updated");
                            console.log(result);
                            let buyer = {
                                bid : result['_id'],
                                name : result['name'],
                                email : result['email'],
                                __v : result['__v'],
                                phone : result['phone']
                            }
                            res.cookie('authCookieb', 'authenticated');
                            res.cookie('userType', 'buyer');
                            res.cookie('userId', 'buyer:'+buyer['bid']);
                            res.cookie('buyerData',JSON.stringify(buyer),{encode:String});
                            res.writeHead(200);
                            res.end("Records Updated");
                        }
                    });
                }else{
                    console.log("Email belongs to someone else");
                    res.writeHead(202);
                    res.end("Email Belongs to someone else.");
                }
            }
        });
   
    }).catch(error => console.log(error));
});

router.post('/home',(req, res)=> {
    let bid = req.body.bid;
    let query = {_id:bid};
    Buyer.find(query, function(err, result){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> HOME ")
        }else{
            if(result.length > 0){
                let data = result[0];
                let buyer = {
                    bid : data['_id'],
                    name : data['name'],
                    email : data['email'],
                    __v : data['__v'],
                    phone : data['phone']
                }
                //console.log(buyer);
                res.send(JSON.stringify(buyer));   
            }else{
                console.log("No user with the given bid found.");
                res.end("You are not authenticated or user found.");
            }
        }
    });  
})


router.post('/profilePictureUpload',upload.single('buyerProfilePicture'), (req,res) =>{
    //console.log(req.body.tesst);
    res.redirect(reactAddress+'buyerHome');
    
})

router.post('/searchItem', (req,res) =>{
    let searchItem = req.body.searchItem;
    console.log(searchItem);

    Restaurant.find( {}, function(err,restaurants){
        if(err){
            console.log(err);
            console.log("Error in first if. Check Backend -> Buyer -> searchItem ");
            res.writeHead(202);
            res.end("Sorry, We're closed!");
        }else{
            let restaurantResult = [];
            for(let restaurant of restaurants){
                let items = restaurant.items;
                for( let item of items){
                    if(item.name == searchItem){
                        restaurantResult.push(
                            {
                                rid : restaurant._id,
                                restaurantName : restaurant.restaurantName,
                                cuisine : restaurant.cuisine
                            }
                        );
                    }
                }
            }
            if(restaurantResult.length == 0 ){
                res.writeHead(202);
                console.log("Item not available at any of the restaurants!");
                res.end("Item not found at any of the restaurants!");
            }else{
                res.writeHead(200);
                res.end(JSON.stringify(restaurantResult));
                console.log(restaurantResult);
            }
        }
    });
})

router.post('/menu', (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
        let rid = req.body.rid;
        Restaurant.find( {_id:rid}, function(err,result){
            if(err){
                console.log(err);
                console.log("Error in first if, Check Backend -> buyer -> menu");
                res.writeHead(404);
                res.end("OOPS!! The restaurant is closed.");
            }else{
                if(result.length > 0 ){
                    let items = result[0].items;
                    let data = [];
                    for( let item of items){
                        data.push({
                            iid: item['_id'],
                            name: item['name'],
                            description: item['description'],
                            section: item['section'],
                            price: item['price']
                        })
                    }
                    res.writeHead(200);
                    res.end(JSON.stringify(data));
                }else{
                    console.log("No Items found at this restaurant.");
                    res.writeHead(404);
                    res.end("OOPS!! The restaurant is closed or out of items.");
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
        Order.create(req.body, function(err,result){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> buyer -> placeOrder ");
                res.writeHead(401);
                res.end();
            }else{
                console.log("Order Placed");
                res.end("Order Placed");
                //console.log(result);
            }
        });
        // console.log(req.body);
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
        Order.find({bid:bid}, function(err,result){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> buyer -> getCurrentOrders ");
                res.writeHead(404);
                res.end("No orders found");
            }else{
                if(result.length > 0){
                    let orders = result;
                    let upcomingOrders = []
                    for(let order of orders){
                        let itemList = [];
                        if(order.status !== 'Delivered' && order.status !== 'Cancelled'){
                            for(let item in order['quantity']){
                                //console.log(item, order['quantity'][item]);
                                itemList.push({'itemName':item, 'qty':order['quantity'][item]});
                            }
                            upcomingOrders.push({
                                'oid' : order['_id'],
                                'itemList' : itemList,
                                'restaurantName' : order['restaurantName'],
                                'status' : order['status'],
                                'total' : order['total']
                            });
                        }    
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
        Order.find({bid:bid}, function(err,result){
            if(err){
                console.log(err);
                console.log("No orders found");
                res.writeHead(404);
                res.end("No orders found");
            }else{
                if(result.length > 0){
                    //console.log(result);
                    let orders = result;
                    let oldOrders = []
                    for(let order of orders){
                        let itemList = [];
                        if(order.status === 'Delivered' || order.status === 'Cancelled'){
                            for(let item in order['quantity']){
                                itemList.push({'itemName':item, 'qty':order['quantity'][item]});
                            }
                            oldOrders.push({
                                'oid' : order['_id'],
                                'itemList' : itemList,
                                'restaurantName' : order['restaurantName'],
                                'status' : order['status'],
                                'total' : order['total']
                            });
                        }    
                    }
                    console.log(oldOrders);
                    res.end(JSON.stringify(oldOrders));
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
    res.redirect(reactAddress+'welcome');
}) 

module.exports = router;