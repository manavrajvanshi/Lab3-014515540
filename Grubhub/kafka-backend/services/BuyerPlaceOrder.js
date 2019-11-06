var database = require('../database/database.js');
const Order = database.Order;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    Order.create(msg, function(err,result){
        if(err){
            callback(err,401);
            console.log(err);
            console.log("Error in first if. Check Kafka -> buyer -> placeOrder ");
        }else{
            console.log("Order Placed");
            callback(null, "Order Placed");
        }
    });
};
exports.handle_request = handle_request;