var mongoose = require('mongoose');
let Schema = mongoose.Schema;
let url = 'mongodb+srv://root:rootroot@cluster0-dqihd.mongodb.net/grubhubproject?retryWrites=true&w=majority';
mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true });

///////////////////////////////////////////
const buyerSchema = new Schema(
    {
        name: String,
        email: String,
        password: String,
        phone: Number
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

const restaurantSchema = new Schema(
    {
        ownerName: String,
        ownerEmail: String,
        ownerPassword: String,
        ownerPhone: Number,
        restaurantName: String,
        restaurantZip: Number,
        cuisine: String,
        items : [itemSchema]
    },
    {
        collection : 'restaurants'
    }
);
///////////////////////////////////////
const orderSchema = new Schema(
    {
        rid: Schema.Types.ObjectId,
        restaurantName : String,
        bid: Schema.Types.ObjectId,
        customerName : String,
        total: Number,
        quantity: {},
        status : {type: String, default:'Pending'},
        deliveryAddress: String,
    },
    {
        collection : 'orders'
    }
);

////////////////////////////////////////
const buyer = mongoose.model('buyer', buyerSchema);
const restaurant = mongoose.model('restaurant', restaurantSchema);
const order = mongoose.model('order',orderSchema);

module.exports = {
    Buyer : buyer,
    Restaurant : restaurant,
    Order : order
}
