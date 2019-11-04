var express = require('express');

const multer = require('multer');
const database = require('../database/database');
const Restaurant = database.Restaurant;

let enVar = require('../enVar.js');
const reactAddress = enVar.reactAddress;

const passport  = require('passport')
const {Strategy,ExtractJwt} = require('passport-jwt');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('owner');
opts.secretOrKey = 'HashString';

let router = express.Router();

passport.use("jwto", new Strategy(opts, function(jwt_payload, done) {
    //console.log("HEREE");
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

const imageStorage = multer.diskStorage({
    destination: 'images/item/',
    filename: function(req, file, cb){
        console.log(req.cookies.item);
        cb(null, req.cookies.item+'.jpg' );
    }
});
const imageUpload = multer({storage:imageStorage});

let signup = require('./restaurantRoutes/signup.js');
router.post('/signup', signup.signup);

let signin = require('./restaurantRoutes/signin.js');
router.post('/signin',signin.signin);


let update = require('./restaurantRoutes/update.js');
router.post('/update', passport.authenticate("jwto",{ session: false }), update.update );

let home = require('./restaurantRoutes/home.js');
router.post('/home',passport.authenticate("jwto",{ session: false }), home.home);

router.post('/profilePictureUpload',ownerUpload.single('ownerProfilePicture'), (req,res) =>{
    res.redirect(reactAddress + 'ownerHome');
});

router.post('/restaurantPictureUpload',restaurantUpload.single('restaurantPicture'), (req,res) =>{
    res.redirect(reactAddress + 'ownerHome');
})

router.post('/itemImage',imageUpload.single('itemImage'), (req,res) =>{
    //console.log(req.cookies.item);
    res.writeHead(200);
    res.end("Image Uploaded");
});

let menu = require('./restaurantRoutes/menu.js');
router.post('/menu', passport.authenticate("jwto",{ session: false }), menu.menu);

let addItem = require('./restaurantRoutes/addItem.js');
router.post('/addItem', passport.authenticate("jwto",{ session: false }) , addItem.addItem);

let deleteMenuItem = require('./restaurantRoutes/deleteMenuItem.js');
router.post('/deleteMenuItem', passport.authenticate("jwto",{ session: false }), deleteMenuItem.deleteMenuItem);

let deleteSection = require('./restaurantRoutes/deleteSection');
router.post('/deleteSection', passport.authenticate("jwto",{ session: false }), deleteSection.deleteSection);

let viewOrders = require('./restaurantRoutes/viewOrders.js')
router.post('/viewOrders', passport.authenticate("jwto",{ session: false }), viewOrders.viewOrders);

let oldOrder = require('./restaurantRoutes/oldOrder.js');
router.post('/oldOrder', passport.authenticate("jwto",{ session: false }), oldOrder.oldOrder);

let updateSection = require('./restaurantRoutes/updateSection.js');
router.post('/updateSection', passport.authenticate("jwto",{ session: false }) , updateSection.updateSection);

let updateStatus = require('./restaurantRoutes/updateStatus.js');
router.post('/updateStatus', passport.authenticate("jwto",{ session: false }), updateStatus.updateStatus);

let updateItem = require('./restaurantRoutes/updateItem');
router.post('/updateItem',  passport.authenticate("jwto",{ session: false }), updateItem.updateItem);

let sendChat = require('./restaurantRoutes/sendChat.js');
router.post('/sendChat', passport.authenticate("jwto",{ session: false }), sendChat.sendChat);

router.get('/logout',(req,res) =>{
    res.clearCookie('authCookieo');
    res.clearCookie('userType');
    res.clearCookie('userId');
    res.clearCookie('ownerData');
    res.redirect(reactAddress+ 'welcome');
});

module.exports = router;