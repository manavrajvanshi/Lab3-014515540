const database = require('../../database/database');
const Order = database.Order;

const viewOrders = (req,res) => {
    if(req.cookies.authCookieo === 'authenticated'||1){
        let rid = req.body.rid;
        //console.log(rid);   
        Order.find({rid : rid}, function(err, result){
            if(err){
                console.log(err);
            }else{
                //console.log(result);
                if(result.length > 0){
                    let orders = result;
                    let upcomingOrders = []
 
                    for(let order of orders){
                        let itemList = [];
                        if(order.status !== 'Delivered' && order.status !== 'Cancelled'){
                            for(let item in order['quantity']){
                                //console.log( order.status == 'Delivered');
                                itemList.push({'itemName':item, 'qty':order['quantity'][item]});
                            }
                            upcomingOrders.push({
                                'oid' : order['_id'],
                                'itemList' : itemList,
                                'buyerName' : order['customerName'],
                                'status' : order['status'],
                                'total' : order['total'],
                                'address': order['deliveryAddress'],
                                'message' : order['message']
                            });
                        }
                    }
                    //console.log(upcomingOrders);
                    res.end(JSON.stringify(upcomingOrders));
                }else{
                    console.log("No orders found");
                    res.writeHead(201);
                    res.end("No orders found");
                }
            }
        });
    }else{
        console.log("Error in second if. Check Backend -> restaurant -> viewOrder ");
        res.writeHead(405);
        res.end("Error in validating authetication");
        
    }
}

module.exports = {
    viewOrders : viewOrders
}