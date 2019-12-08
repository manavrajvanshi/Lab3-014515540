const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema.js');
const mongoose = require('mongoose');
const app = express();
const PORT = 3001;

let dbConn = 'mongodb+srv://root:rootroot@cluster0-dqihd.mongodb.net/lab3?retryWrites=true&w=majority';
mongoose.connect(dbConn,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
mongoose.connection.once('open', ()=>{
    console.log("Connected to MongoDB Atlas");
})

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql : true
})); 

app.listen(PORT, ()=>{
    console.log(`Your server is listening @ PORT ${PORT}`)
});