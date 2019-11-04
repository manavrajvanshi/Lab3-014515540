var express = require('express');
const multer = require('multer');

const database = require('../database/database');
const Buyer = database.Buyer;

const enVar = require('../enVar.js');
const reactAddress = enVar.reactAddress;

const passport  = require('passport')
const {Strategy,ExtractJwt} = require('passport-jwt')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('buyer');
opts.secretOrKey = 'HashString';


passport.use("jwtb", new Strategy(opts, function(jwt_payload, done) {
    Buyer.findOne({_id: jwt_payload.bid}, function(err, user) {
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

const storage = multer.diskStorage({
    destination: 'images/buyer/',
    filename: function(req, file, cb){       
        let currentUserCookie = JSON.parse(req.cookies.buyerData);
        cb(null, currentUserCookie.bid+'.jpg' );
    }
});

const upload = multer({storage:storage});
let router = express.Router();

let signup = require('./buyerRoutes/signup.js');
router.post('/signup', signup.signup);

let signin = require('./buyerRoutes/signin.js');
router.post('/signin',signin.signin);

let update = require('./buyerRoutes/update.js');
router.post('/update', passport.authenticate("jwtb",{ session: false }), update.update);

let home = require('./buyerRoutes/home.js');
router.post('/home', passport.authenticate("jwtb",{ session: false }), home.home );

router.post('/profilePictureUpload',upload.single('buyerProfilePicture'), (req,res) =>{
    res.redirect(reactAddress+'buyerHome'); 
})

let searchItem = require('./buyerRoutes/searchItem.js');
router.post('/searchItem' , passport.authenticate("jwtb",{ session: false }), searchItem.searchItem);

let menu = require('./buyerRoutes/menu.js');
router.post('/menu', passport.authenticate("jwtb",{ session: false }), menu.menu);

let placeOrder = require('./buyerRoutes/placeOrder.js');
router.post('/placeOrder', passport.authenticate("jwtb",{ session: false }), placeOrder.placeOrder);

let getCurrentOrders = require('./buyerRoutes/getCurrentOrders.js');
router.post('/getCurrentOrders',passport.authenticate("jwtb",{ session: false }), getCurrentOrders.getCurrentOrders);

let getPastOrders = require('./buyerRoutes/getPastOrders.js');
router.post('/getPastOrders',passport.authenticate("jwtb",{ session: false }), getPastOrders.getPastOrders);

let sendChat = require('./buyerRoutes/sendChat.js');
router.post('/sendChat', passport.authenticate("jwtb",{ session: false }), sendChat.sendChat);

router.get('/logout',(req,res) =>{
    res.clearCookie('authCookieb');
    res.clearCookie('userType');
    res.clearCookie('userId');
    res.clearCookie('buyerData');
    res.redirect(reactAddress+'welcome');
}) 

module.exports = router;