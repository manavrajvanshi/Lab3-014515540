var database = require('../database/database.js');
const Order = database.Order;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let rid = msg.rid;
    //console.log(rid);   
    Order.find({rid : rid}, function(err, result){
        if(err){
            console.log("Error in first if. Check Kafka -> restaurants -> oldOrders ");
            callback(err,null);
        }else{
            //console.log(result);
            if(result.length > 0){
                let orders = result;
                let oldOrders = []

                for(let order of orders){
                    let itemList = [];
                    if(order.status === 'Delivered' || order.status === 'Cancelled'){
                        for(let item in order['quantity']){
                            //console.log( order.status == 'Delivered');
                            itemList.push({'itemName':item, 'qty':order['quantity'][item]});
                        }
                        oldOrders.push({
                            'oid' : order['_id'],
                            'itemList' : itemList,
                            'buyerName' : order['customerName'],
                            'status' : order['status'],
                            'total' : order['total'],
                            'address': order['deliveryAddress']
                        });
                    }
                }
                //console.log(oldOrders);
                callback(null, oldOrders);
            }else{
                console.log("No orders found");
                callback(null,201);
            }
        }
    });
};
exports.handle_request = handle_request;