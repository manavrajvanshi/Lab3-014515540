const express = require ('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require ('cookie-parser');

const buyerRoute = require('./routes/buyer.js');
const restaurantRoute = require('./routes/restaurant.js');

const passport = require('passport');

const app = express();
const PORT = 3001;

app.use(express.static(__dirname + '/images'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

app.use('/buyer',buyerRoute);
app.use('/restaurant',restaurantRoute);

app.listen(PORT, ()=>{
    console.log(`Your server is listening @ PORT ${PORT}`)
});