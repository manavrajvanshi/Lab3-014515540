const graphql = require('graphql'); 

const {
    GraphQLObjectType,
    GraphQLString, 
    GraphQLSchema,
    GraphQLID
} = graphql;

var buyers = [
    {id:'1', firstName : 'Tony', lastName : 'Stark', email : 'iam@ironman.com', password : 'jarvis'},
    {id:'2', firstName : 'Thor', lastName : 'Odinson', email : 'thunder@hotmail.com', password : 'mjonir'},
    {id:'3', firstName : 'Harry', lastName : 'Potter', email : 'hp@hogwarts.com', password : 'stupefy'},
    {id:'4', firstName : 'Manav', lastName : 'Rajvanshi', email : 'manavraj97@hotmail.com', password : 'abcd1234'}
];
const BuyerType = new GraphQLObjectType({
    name : 'Buyer',
    fields : () => ({
        id : { type : GraphQLID },
        firstName : { type : GraphQLString },
        lastName : { type : GraphQLString },
        email : { type : GraphQLString },
        password : { type : GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        buyer :{
            type : BuyerType,
            args : { id : {type : GraphQLID}},
            resolve(parent, args){
                for(buyer of buyers){
                    if( buyer.id == args.id){
                        return buyer;
                    }
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query : RootQuery
});