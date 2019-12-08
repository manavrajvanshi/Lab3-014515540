const graphql = require('graphql'); 
const {Buyer, Owner} = require('../database/database.js')


const {
    GraphQLObjectType,
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLInt
} = graphql;

var buyers = [
    {id:'1', firstName : 'Tony', lastName : 'Stark', email : 'iam@ironman.com', password : 'jarvis'},
    {id:'2', firstName : 'Thor', lastName : 'Odinson', email : 'thunder@hotmail.com', password : 'mjonir'},
    {id:'3', firstName : 'Harry', lastName : 'Potter', email : 'hp@hogwarts.com', password : 'stupefy'},
    {id:'4', firstName : 'Manav', lastName : 'Rajvanshi', email : 'manavraj97@hotmail.com', password : 'abcd1234'}
];

var owners = [
    {id:'1', firstName : 'Tony', lastName : 'Stark', email : 'iam@ironman.com', password : 'jarvis', restaurant:'rest 1', cuisine: 'cuisine 1'},
    {id:'2', firstName : 'Thor', lastName : 'Odinson', email : 'thunder@hotmail.com', password : 'mjonir', restaurant:'rest 2', cuisine: 'cuisine 2'},
    {id:'3', firstName : 'Harry', lastName : 'Potter', email : 'hp@hogwarts.com', password : 'stupefy', restaurant:'rest 3', cuisine: 'cuisine 3'},
    {id:'4', firstName : 'Manav', lastName : 'Rajvanshi', email : 'manavraj97@hotmail.com', password : 'abcd1234', restaurant:'rest 4', cuisine: 'cuisine 4'}
];

var menus =[
    {
        rid : 1,
        items : [
            {name : 'Chicken', price: 10, description:'Grilled', section: 'snacks'},
            {name : 'Pasta', price: 10, description:'Red', section: 'snacks'},
            {name : 'Burger', price: 10, description:'Cheese', section: 'lunch'}
        ]
    },
    {
        rid : 2,
        items : [
            {name : 'Mutton', price: 10, description:'Grilled', section: 'snacks'},
            {name : 'Pasta', price: 10, description:'Red', section: 'snacks'},
            {name : 'Burger', price: 10, description:'Cheese', section: 'lunch'}
        ]
    },
    {
        rid : 3,
        items : [
            {name : 'Chicken', price: 10, description:'Grilled', section: 'snacks'},
            {name : 'Pasta', price: 10, description:'Red', section: 'snacks'},
            {name : 'Burger', price: 10, description:'Cheese', section: 'lunch'}
        ]
    },
    {
        rid : 4,
        items : [
            {name : 'Sausage', price: 10, description:'Grilled', section: 'snacks'},
            {name : 'Pasta', price: 10, description:'Red', section: 'snacks'},
            {name : 'Burger', price: 10, description:'Cheese', section: 'lunch'}
        ]
    }
    
]

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

const OwnerType = new GraphQLObjectType({
    name : 'Owner',
    fields : () => ({
        id : { type : GraphQLID },
        firstName : { type : GraphQLString },
        lastName : { type : GraphQLString },
        email : { type : GraphQLString },
        password : { type : GraphQLString },
        restaurant : {type : GraphQLString},
        cuisine : {type : GraphQLString},
        menu : {
            type : MenuType,
            resolve(parent, args){
                //console.log(parent);
                for(menu of menus){
                    if( menu.rid == parent.id){
                        return menu;
                    }
                }
            }

        }
    })
});

const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields : () => ({
        name : {type : GraphQLString},
        price : {type : GraphQLInt},
        description : {type : GraphQLString},
        section : {type : GraphQLString}
    })
})
const MenuType = new GraphQLObjectType({
    name : 'Menu',
    fields : () => ({
        rid : { type : GraphQLID },
        items : {type: new GraphQLList(ItemType)} ,
        owner :{
            type : OwnerType,
            resolve(parent, args){
                //console.log(parent);
                for(owner of owners){
                    if( owner.id == parent.rid){
                        return owner;
                    }
                }
            }
        }
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
        },

        owner :{
            type : OwnerType,
            args : { id : {type : GraphQLID}},
            resolve(parent, args){
                for(owner of owners){
                    if( owner.id == args.id){
                        return owner;
                    }
                }
            }
        },

        menu :{
            type : MenuType,
            args : { rid : {type : GraphQLID}},
            resolve(parent, args){
                for(menu of menus){
                    if( menu.rid == args.rid){
                        return menu;
                    }
                }
            }
        },

        searchItem :{
            type : new GraphQLList(MenuType),
            args : {name: {type:GraphQLString}},
            resolve(parent,args){
                let rest = menus.filter( (menu)=>{
                    //console.log(menu.items);
                    for(let item of menu.items){
                        return item.name == args.name;
                    }
                });
                return rest;
            }

        }
        
    }
});

const Mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields: {
        signupBuyer:{
            type : BuyerType,
            args :{
                firstName : { type : GraphQLString },
                lastName : { type : GraphQLString },
                email : { type : GraphQLString },
                password : { type : GraphQLString }
            },
            async resolve(parent, args){
                let buyer = new Buyer({
                    firstName : args.firstName,
                    lastName : args.lastName,
                    email : args.email,
                    password : args.password
                });

                let b = await buyer.save();
                return b == null? null : b;
            }
        },
        signUpOwner:{
            type : OwnerType,
            args :{
                firstName : { type : GraphQLString },
                lastName : { type : GraphQLString },
                email : { type : GraphQLString },
                password : { type : GraphQLString },
                restaurant : { type : GraphQLString },
                cuisine : { type : GraphQLString }
            },
            async resolve(parent, args){
                let owner = new Owner({
                    firstName : args.firstName,
                    lastName : args.lastName,
                    email : args.email,
                    password : args.password,
                    restaurant: args.restaurant,
                    cuisine : args.cuisine
                });

                let b = await buyer.save();
                return b == null? null : b;
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation : Mutation
});