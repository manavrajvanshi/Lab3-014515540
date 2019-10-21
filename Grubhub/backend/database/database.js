var mongoose = require('mongoose');
let Schema = mongoose.Schema;
let url = 'mongodb+srv://root:rootroot@cluster0-dqihd.mongodb.net/grubhubproject?retryWrites=true&w=majority';
mongoose.connect(url, {useNewUrlParser: true});


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

const restaurantSchema = new Schema(
    {
        ownerName: String,
        ownerEmail: String,
        ownerPassword: String,
        ownerPhone: Number,
        restaurantName: String,
        restaurantZip: Number,
        cuisine: String
    },
    {
        collection : 'restaurants'
    }
);

const orders = new Schema(
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

const buyer = mongoose.model('buyer', buyerSchema);
const restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = {
    Buyer : buyer,
    Restaurant : restaurant
}
