const express = require ('express');
const bodyParser = require('body-parser');

const buyerRoute = require('./routes/buyer.js');
const restaurantRoute = require('./routes/restaurant.js');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/buyer',buyerRoute);
app.use('/restaurant',restaurantRoute);

app.listen(PORT, ()=>{
    console.log(`Your server is listening @ PORT ${PORT}`)
});