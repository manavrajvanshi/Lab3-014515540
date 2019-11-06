var database = require('../database/database.js');
const Order = database.Order;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    Order.findById( msg.oid, function(err, order){
        if(err){
            console.log(err);
            console.log("Error in Second if. Check Kafka -> restaurant -> updateStatus ");
            callback(err,400);
        }else{
            order.status = msg.status;
            order.save( function (err, result){
                if(err){
                    console.log("Error in Third if. Check Backend -> restaurant -> updateStatus ");
                    callback(null,400);
                }else{
                    callback(null, 200);     
                }
            } );
        }
    });
};
exports.handle_request = handle_request;