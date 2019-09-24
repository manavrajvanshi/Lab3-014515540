const express = require ('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require ('cookie-parser');

const buyerRoute = require('./routes/buyer.js');
const restaurantRoute = require('./routes/restaurant.js');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/buyer',buyerRoute);
app.use('/restaurant',restaurantRoute);

app.listen(PORT, ()=>{
    console.log(`Your server is listening @ PORT ${PORT}`)
});