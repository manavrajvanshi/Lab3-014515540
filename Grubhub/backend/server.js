const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema.js');
const app = express();
const PORT = 3001;

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql : true
})); 

app.listen(PORT, ()=>{
    console.log(`Your server is listening @ PORT ${PORT}`)
});