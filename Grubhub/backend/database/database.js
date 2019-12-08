var mongoose = require('mongoose');
let Schema = mongoose.Schema;
///////////////////////////////////////////
const buyerSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        password: String
    },
    {
        collection : 'buyers'
    }
);
//////////////////////////////////////////
let itemSchema = new Schema({
    name: String,
    description: String,
    section: String,
    price: Number,
    rid : Schema.Types.ObjectId
});

const ownerSchema = new Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        password: Number,
        restaurant: String,
        cuisine: String,
        menu : [itemSchema]
    },
    {
        collection : 'owners'
    }
);
// ///////////////////////////////////////
// const orderSchema = new Schema(
//     {
//         rid: Schema.Types.ObjectId,
//         restaurantName : String,
//         bid: Schema.Types.ObjectId,
//         customerName : String,
//         total: Number,
//         quantity: {},
//         status : {type: String, default:'Pending'},
//         deliveryAddress: String,
//         message:[]
//     },
//     {
//         collection : 'orders'
//     }
// );

////////////////////////////////////////
const buyer = mongoose.model('buyer', buyerSchema);
const owner = mongoose.model('owner', ownerSchema);
// const order = mongoose.model('order',orderSchema);

module.exports = {
    Buyer : buyer,
    Owner : owner
    // Restaurant : restaurant,
    // Order : order
}
