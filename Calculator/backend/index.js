var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var PORT = 3001;


app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.post('/', (req,res) => {
    let q = req.body.query;
    let calculated = eval(q);
    console.log(`Calculation performed : ${q} = ${calculated}`);
    
    if(isNaN(calculated) || calculated === Infinity){
        calculated = "Error, Invalid Input!";
        //console.log("Inside IF ");
    }
    else{
        calculated = calculated.toString(10);
        //console.log("Inside Else ");
    }
    res.writeHead(200);
    res.end(calculated);
    
})

app.listen( PORT , ()=>{
    console.log(`Calculator API listening on port ${PORT}`);
})