var database = require('../database/database.js');
const Order = database.Order;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let bid = msg.bid;
    Order.find({bid:bid}, function(err,result){
        if(err){
            console.log(err);
            console.log("No orders found");
            callback(err,404);
        }else{
            if(result.length > 0){
                let orders = result;
                let oldOrders = []
                for(let order of orders){
                    let itemList = [];
                    if(order.status === 'Delivered' || order.status === 'Cancelled'){
                        for(let item in order['quantity']){
                            itemList.push({'itemName':item, 'qty':order['quantity'][item]});
                        }
                        oldOrders.push({
                            'oid' : order['_id'],
                            'itemList' : itemList,
                            'restaurantName' : order['restaurantName'],
                            'status' : order['status'],
                            'total' : order['total']

                        });
                    }    
                }
                //console.log(oldOrders);
                callback(null, oldOrders);
            }else{
                console.log("No orders found");
                callback(null,404);
            }
        }
    });

};
exports.handle_request = handle_request;