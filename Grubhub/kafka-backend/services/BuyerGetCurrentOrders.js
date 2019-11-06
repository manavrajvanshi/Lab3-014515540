var database = require('../database/database.js');
const Order = database.Order;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let bid = msg.bid;
    Order.find({bid:bid}, function(err,result){
        if(err){
            console.log(err);
            console.log("Error in first if. Check Kafka -> buyer -> getCurrentOrders ");
            callback(err,404);
        }else{
            if(result.length > 0){
                let orders = result;
                let upcomingOrders = []
                for(let order of orders){
                    let itemList = [];
                    if(order.status !== 'Delivered' && order.status !== 'Cancelled'){
                        for(let item in order['quantity']){
                            itemList.push({'itemName':item, 'qty':order['quantity'][item]});
                        }
                        upcomingOrders.push({
                            'oid' : order['_id'],
                            'itemList' : itemList,
                            'restaurantName' : order['restaurantName'],
                            'status' : order['status'],
                            'total' : order['total'],
                            'message' : order['message']
                        });
                    }    
                }
                //console.log(upcomingOrders);
                callback(null, upcomingOrders);
            }else{
                console.log("No orders found");
                callback(null,404);
            }
        }
    });

};
exports.handle_request = handle_request;