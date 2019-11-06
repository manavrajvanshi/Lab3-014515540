var database = require('../database/database.js');
const Order = database.Order;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let oid = msg.oid;
    let chatMessage = msg.chatMessage;
    Order.findById(oid, function(err,order){
        if(err){
            callback(err,401);
        }else{
            if(order){
                order.message.push({'type':'restaurant','message':chatMessage});
                order.save(function (err, result){
                    if(err){
                        console.log("Error in Third if. Check Backend -> owner -> sendChat ");
                        callback(null,400);
                    }else{
                        callback(null,result.message);
                    }
                })
            }

        }
    })
};
exports.handle_request = handle_request;