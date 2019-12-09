const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema.js');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const PORT = 3001;

let dbConn = 'mongodb+srv://root:rootroot@cluster0-dqihd.mongodb.net/lab3?retryWrites=true&w=majority';
mongoose.connect(dbConn,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.connection.once('open', ()=>{
    console.log("Connected to MongoDB Atlas");
})
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql : true
})); 

app.listen(PORT, ()=>{
    console.log(`Your server is listening @ PORT ${PORT}`)
});