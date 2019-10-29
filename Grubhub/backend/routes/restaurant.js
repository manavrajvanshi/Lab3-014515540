var express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const database = require('../database/database');
const Restaurant = database.Restaurant;
const Order = database.Order;
let enVar = require('../enVar.js');
const reactAddress = enVar.reactAddress;

const jwt = require('jsonwebtoken'); 
const passport  = require('passport')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('owner');
opts.secretOrKey = 'HashString';


passport.use("jwt", new JwtStrategy(opts, function(jwt_payload, done) {
    // console.log("HEREE");
    // console.log(jwt_payload);
    Restaurant.findOne({_id: jwt_payload.rid}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));


const ownerStorage = multer.diskStorage({
    destination: 'images/owner/',
    filename: function(req, file, cb){
        
        let currentUserCookie = JSON.parse(req.cookies.ownerData);
        
        cb(null, currentUserCookie.rid+'.jpg' );
    }
});

const ownerUpload = multer({storage:ownerStorage});

const restaurantStorage = multer.diskStorage({
    destination: 'images/restaurant/',
    filename: function(req, file, cb){
        
        let currentUserCookie = JSON.parse(req.cookies.ownerData);
        
        cb(null, currentUserCookie.rid+'.jpg' );
    }
});

const restaurantUpload = multer({storage:restaurantStorage});




let router = express.Router();
router.post('/signup', (req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let restaurantName = req.body.restaurantName;
    let restaurantZip = req.body.restaurantZip;
    
    bcrypt.hash(password, 10).then(function(hashedPassword){

        let query = {ownerEmail : email};
        Restaurant.find(query, function(err,result){
            if(err){
                console.log("Error in first if. Check Backend -> Owner -> Signup \n ");
                res.writeHead(400);
                res.send("Error");
            }else{
                console.log(result);
                console.log("Checking if email exists in restaurants table.");
                if(result.length == 0 ){
                    console.log("Entering the new details of owner");
                    let restaurant = new Restaurant({
                        ownerName:name,
                        ownerEmail:email,
                        ownerPassword:hashedPassword,
                        restaurantName:restaurantName,
                        restaurantZip:restaurantZip
                    });
                    restaurant.save(function(err,result){
                        if(err){
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
    let query = {ownerEmail:email};
    Restaurant.find(query, function(err, result){
        if(err){
            res.writeHead(203);
            res.end();
            console.log("Error in first if. Check Backend -> Restaurant -> Signin ");
        }else{
            if(result.length > 0 ){
                let data = result[0];
                console.log(data);
                let hashedPassword = data['ownerPassword'];
                console.log("ownerEmail matched, checking for password!");
                bcrypt.compare(password, hashedPassword).then(function(matched) {
                    if(matched){
                        let owner = {
                            rid: data['_id'],
                            ownerName: data['ownerName'],
                            ownerEmail: data['ownerEmail'],
                            ownerPhone: data['ownerPhone'],
                            restaurantName: data['restaurantName'],
                            restaurantZip: data['restaurantZip'],
                            cuisine : data['cuisine'],
                            __v : data['__v']
                        }

                        res.cookie('authCookieo', 'authenticated');
                        res.cookie('userType', 'owner');
                        res.cookie('rid', JSON.stringify(owner['rid']),{encode:String});
                        // console.log("OWNER RID");
                        // console.log(JSON.stringify(owner['rid']),{encode:String});
                        res.cookie('ownerData',JSON.stringify(owner),{encode:String});
                        let token = jwt.sign({rid : owner['rid']}, "HashString");
                        console.log("Token: "+token);
                        res.setHeader("Access-Control-Expose-Headers","Authorization");
                        res.header({"Authorization": 'owner '+token});
                        res.writeHead(200);
                        res.end("Signed in successfully");
                        console.log("Owner Signed in");

                        console.log(owner);
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



router.post('/update', passport.authenticate("jwt",{ session: false }), (req,res) =>{
    let ownerName = req.body.ownerName;
    let ownerEmail = req.body.ownerEmail;
    let ownerPassword = req.body.ownerPassword;
    let ownerPhone = req.body.ownerPhone;
    let rid = req.body.rid;
    let restaurantName = req.body.restaurantName;
    let restaurantZip = req.body.restaurantZip;
    let cuisine = req.body.cuisine;
    let selfFlag = false;
    let query = {_id:rid};
    Restaurant.find(query, function(err,result){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> update ");
        }else{
            if(result.length > 0 ){
                if( result[0].ownerEmail === ownerEmail){
                    selfFlag = true;
                }else{
                    selfFlag = false;
                }
            }else{
                selfFlag = false;
            }
        }
    });
    bcrypt.hash(ownerPassword, 10).then(function(hashedPassword){
        let query = {ownerEmail:ownerEmail};
        Restaurant.find(query, function(err,result){
            if(err){
                console.log("Error in first if. Check Backend -> restaurant -> update ");
                res.writeHead(201);
                res.end("Data not updated, Error in first if. Check Backend -> restaurant -> update.")
            }else{
                console.log("Checking if email exists in restaurants table.");
                if(result.length == 0 || selfFlag){
                    let query = {_id:rid};
                    let owner = {
                        ownerName: ownerName,
                        ownerEmail: ownerEmail,
                        ownerPassword: hashedPassword,
                        ownerPhone: ownerPhone,
                        restaurantName: restaurantName,
                        restaurantZip: restaurantZip,
                        cuisine: cuisine
                    };
                    Restaurant.findOneAndUpdate(query,owner,{new:true}, function(err,result){
                        if(err){
                            res.writeHead(202);
                            res.end("Error in if 2, Check Backend -> restaurant -> update ")
                            console.log("Error in if 2, Check Backend -> restaurant -> update ")
                        }else{
                            console.log(result);
                            let data = result;
                            let owner = {
                                rid: data['_id'],
                                ownerName: data['ownerName'],
                                ownerEmail: data['ownerEmail'],
                                ownerPhone: data['ownerPhone'],
                                restaurantName: data['restaurantName'],
                                restaurantZip: data['restaurantZip'],
                                cuisine : data['cuisine'],
                                __v : data['__v']
                            }
                            res.cookie('authCookieo', 'authenticated');
                            res.cookie('userType', 'owner');
                            res.cookie('rid', owner['rid']);
                            res.cookie('ownerData',JSON.stringify(owner),{encode:String});
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


router.post('/home',passport.authenticate("jwt",{ session: false }),(req, res)=> {
    let rid = req.body.rid;
    let query = { _id: rid};
    Restaurant.find(query, function(err,result){
        if(err){
            console.log("Error in first if. Check Backend -> owner -> HOME ")
        }else{
            if(result.length > 0){
                let data = result[0];
                let owner = {
                    rid: data['_id'],
                    ownerName: data['ownerName'],
                    ownerEmail: data['ownerEmail'],
                    ownerPhone: data['ownerPhone'],
                    restaurantName: data['restaurantName'],
                    restaurantZip: data['restaurantZip'],
                    cuisine : data['cuisine'],
                    __v : data['__v']
                }
                res.end(JSON.stringify(owner));    
            }else{
                console.log("No user with the given rid found.");
                res.end("You are not authenticated or user not found.");
            }     
        }
    }); 
});



router.post('/profilePictureUpload',ownerUpload.single('ownerProfilePicture'), (req,res) =>{
    res.redirect(reactAddress + 'ownerHome');
})

router.post('/restaurantPictureUpload',restaurantUpload.single('restaurantPicture'), (req,res) =>{
    res.redirect(reactAddress + 'ownerHome');
})

const imageStorage = multer.diskStorage({
    destination: 'images/item/',
    filename: function(req, file, cb){
        console.log(req.cookies.item);
        cb(null, req.cookies.item+'.jpg' );
    }
});

const imageUpload = multer({storage:imageStorage});

router.post('/itemImage',imageUpload.single('itemImage'), (req,res) =>{
    console.log(req.cookies.item);
    res.writeHead(200);
    res.end("Image Uploaded");
})

router.post('/menu', passport.authenticate("jwt",{ session: false }), (req,res) => {
    if(req.cookies.authCookieo === 'authenticated'){
        let ownerData = req.cookies.ownerData;
        let rid = JSON.parse(ownerData).rid;
        Restaurant.findById(rid, function(err, result){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> restaurant -> menu ")
            }else{
                if(result){
                    let items = result.items;
                    console.log(result);
                    res.end(JSON.stringify(items));
                }else{
                    console.log("No items stored");
                    console.log(result);
                    res.end();
                }
            }
        });
    }else{
        console.log("Not Authenticated (Backend / Restaurant / menu)");
        res.writeHead(405);
    }
});

router.post('/addItem', passport.authenticate("jwt",{ session: false }) , (req, res)=>{

    let name = req.body.name;
    let description = req.body.description;
    let price = req.body.price;
    let section = req.body.section;
    let rid = req.body.rid;
    //console.log(name, description, price, section, rid);
    if(req.cookies.authCookieo === 'authenticated'){
        Restaurant.findById(rid, function(err, result){
            if(err){
              console.log(err);
              console.log("Error in first if. Check Backend -> restaurant -> addItem ");
            }else{
              let restaurant = result;
              let item = {
                name: name,
                description : description,
                section : section,
                price: price,
                rid : rid
              };
              restaurant.items.push(item);
              restaurant.save( function(err,result){
                if(err){
                    res.writeHead(400);
                    res.end();
                    console.log(err);
                    console.log("Error in second if. Check Backend -> restaurant -> addItem ");
                }else{
                    console.log(result);
                    res.writeHead(200);
                    res.end();
                    console.log("Item Added");
                }
              });
            }
          });
    }else{
        console.log("Not Authenticated (/addItem)");
        res.writeHead(400);
        res.end();
    }
});

router.post('/deleteMenuItem', passport.authenticate("jwt",{ session: false }), (req,res) => {
    if( req.cookies.authCookieo === 'authenticated'){
        let iid = req.body.iid;
        let rid = req.body.rid;
        console.log(iid, rid);

        Restaurant.findById(rid, function(err, restaurant){
            if(err){
              console.log(err);
              console.log("Error in first if. Check Backend -> restaurant -> deleteMenuItem");
              res.writeHead(500);
              res.end();
            }else{
                console.log(restaurant);
                let items = restaurant.items;
                for(let item of items){     
                    if( item._id == iid  ){
                    item.remove();
                    break;
                    }
                }
                restaurant.save(function(err,result){
                    if(err){
                        console.log(err);
                        console.log("Error in Second if. Check Backend -> restaurant -> deleteMenuItem");
                        res.writeHead(500);
                        res.end();
                    }else{
                        console.log(result);
                        res.writeHead(200);
                        res.end();
                        console.log("Item Deleted"); 
                    }
                })
            }
        });
    }
});

router.post('/deleteSection', passport.authenticate("jwt",{ session: false }),(req,res) =>{
    if(req.cookies.authCookieo === 'authenticated'){
        let rid = req.body.rid;
        let section = req.body.section;

        Restaurant.findById(rid, function(err, restaurant){
            if(err){
              console.log(err);
              console.log("Error in first if. Check Backend -> restaurant -> deleteSection");
              res.writeHead(400);
              res.end("Section not deleted");
            }else{
                console.log(restaurant);
                let items = restaurant.items;
                var i = items.length-1;
                while (i>=0) {
                    var item = items[i];
                    if( item.section == section  ){
                        item.remove();
                    }
                    i--;
                }
                restaurant.save(function(err,result){
                    if(err){
                        console.log(err);
                        console.log("Error in Second if. Check Backend -> restaurant -> deleteSection");
                        res.writeHead(400);
                        res.end("Section Not Deleted");
                    }else{
                        console.log(result);
                        res.writeHead(200);
                        res.end("Section Deleted");
                        console.log("Section Deleted"); 
                    }
                })
            }
        });
    }else{
        res.redirect(reactAddress + 'ownerLogin');
    }
})


router.post('/viewOrders', passport.authenticate("jwt",{ session: false }), (req,res) => {
    if(req.cookies.authCookieo === 'authenticated'||1){
        let rid = req.body.rid;
        //console.log(rid);   
        Order.find({rid : rid}, function(err, result){
            if(err){
                console.log(err);
            }else{
                //console.log(result);
                if(result.length > 0){
                    let orders = result;
                    let upcomingOrders = []
 
                    for(let order of orders){
                        let itemList = [];
                        if(order.status !== 'Delivered' && order.status !== 'Cancelled'){
                            for(let item in order['quantity']){
                                //console.log( order.status == 'Delivered');
                                itemList.push({'itemName':item, 'qty':order['quantity'][item]});
                            }
                            upcomingOrders.push({
                                'oid' : order['_id'],
                                'itemList' : itemList,
                                'buyerName' : order['customerName'],
                                'status' : order['status'],
                                'total' : order['total'],
                                'address': order['deliveryAddress']
                            });
                        }
                    }
                    //console.log(upcomingOrders);
                    res.end(JSON.stringify(upcomingOrders));
                }else{
                    console.log("No orders found");
                    res.writeHead(201);
                    res.end("No orders found");
                }
            }
        });
    }else{
        console.log("Error in second if. Check Backend -> restaurant -> viewOrder ");
        res.writeHead(405);
        res.end("Error in validating authetication");
        
    }
})

router.post('/oldOrder', passport.authenticate("jwt",{ session: false }), (req,res) => {

    if(req.cookies.authCookieo === 'authenticated'||1){
        let rid = req.body.rid;
        //console.log(rid);   
        Order.find({rid : rid}, function(err, result){
            if(err){
                console.log("Error in first if. Check Backend -> restaurants -> oldOrders ")
            }else{
                //console.log(result);
                if(result.length > 0){
                    let orders = result;
                    let oldOrders = []
 
                    for(let order of orders){
                        let itemList = [];
                        if(order.status === 'Delivered' || order.status === 'Cancelled'){
                            for(let item in order['quantity']){
                                //console.log( order.status == 'Delivered');
                                itemList.push({'itemName':item, 'qty':order['quantity'][item]});
                            }
                            oldOrders.push({
                                'oid' : order['_id'],
                                'itemList' : itemList,
                                'buyerName' : order['customerName'],
                                'status' : order['status'],
                                'total' : order['total'],
                                'address': order['deliveryAddress']
                            });
                        }
                    }
                    console.log(oldOrders);
                    res.end(JSON.stringify(oldOrders));
                }else{
                    console.log("No orders found");
                    res.writeHead(201);
                    res.end("No orders found");
                }
            }
        });
    }else{
        console.log("Error in second if. Check Backend -> Restaurant -> oldOrders ");
        res.writeHead(405);
        res.end("Error in validating authetication");
        
    }
   
})

router.post('/updateSection', passport.authenticate("jwt",{ session: false }) , (req,res) => {
    if(req.cookies.authCookieo === 'authenticated'){
        let rid = req.body.rid;
        let oldSection = req.body.oldSection;
        let newSectionName = req.body.newSectionName;
        Restaurant.findById(rid, function(err, restaurant){
            if(err){
              console.log(err);
              console.log("Error in first if. Check Backend -> restaurant -> updateSection");
              res.writeHead(400);
              res.end("Section Not Updated");
            }else{
                console.log(restaurant);
                let items = restaurant.items;
                for(let item of items){     
                    if( item.section == oldSection  ){
                        item.section = newSectionName;
                    }
                }
                restaurant.save(function(err,result){
                    if(err){
                        console.log(err);
                        console.log("Error in Second if. Check Backend -> restaurant -> updateSection");
                        res.writeHead(400);
                        res.end("Section Not Updated");
                    }else{
                        console.log(result);
                        res.writeHead(200);
                        res.end("Section Updated");
                        console.log("Section Updated"); 
                    }
                })
            }
        });
    }
})

router.post('/updateStatus', passport.authenticate("jwt",{ session: false }), (req,res) =>{
    if(req.cookies.authCookieo === 'authenticated'){
        Order.findById( req.body.oid, function(err, order){
            if(err){
                console.log(err);
                console.log("Error in Second if. Check Backend -> restaurant -> updateStatus ");
                res.writeHead(400);
                res.end("Status Not Updated");
            }else{
                order.status = req.body.status;
                order.save( function (err, result){
                    if(err){
                        console.log("Error in Third if. Check Backend -> restaurant -> updateStatus ");
                        res.writeHead(400);
                        res.end("Status Not Updated");
                    }else{
                        res.writeHead(200);
                        res.end('Status Updated');       
                    }
                } );
            }
        });
    }else{
        console.log("Error in first if/else. Check Backend -> restaurant -> updateStatus ");
        res.writeHead(400);
        res.end("Status Not Updated / Not Authorized");
    }
})

router.post('/updateItem',  passport.authenticate("jwt",{ session: false }) ,(req,res) =>{
    let name = req.body.nameUpdate;
    let description = req.body.descriptionUpdate;
    let price = req.body.priceUpdate;
    let section = req.body.sectionUpdate;
    let iid = req.body.iid;
    let rid = req.body.rid;

    console.log(req.body);
    console.log(rid);

    Restaurant.findById(rid, function(err, restaurant){
        if(err){
          console.log(err);
          console.log("Error in first if. Check Backend -> restaurant -> updateItem");
          res.writeHead(400);
          res.end("Item Not Updated");
        }else{
            console.log(restaurant);
            let items = restaurant.items;
            for(let item of items){     
                if( item._id == iid  ){
                    item.name = name;
                    item.description = description;
                    item.section = section;
                    item.price = price;
                    break;
                }
            }
            restaurant.save(function(err,result){
                if(err){
                    console.log(err);
                    console.log("Error in Second if. Check Backend -> restaurant -> updateItem");
                    res.writeHead(400);
                    res.end("Item Not Updated");
                }else{
                    console.log(result);
                    res.writeHead(200);
                    res.end("Item Updated");
                    console.log("Item Updated"); 
                }
            })
        }
    });
})

router.get('/logout',(req,res) =>{
    res.clearCookie('authCookieo');
    res.clearCookie('userType');
    res.clearCookie('userId');
    res.clearCookie('ownerData');
    res.redirect(reactAddress+ 'welcome');
});

module.exports = router;