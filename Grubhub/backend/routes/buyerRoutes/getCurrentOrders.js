const database = require('../../database/database');
const Order = database.Order;

const getCurrentOrders = (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
        let bid = req.body.bid;
        // console.log(query);
        Order.find({bid:bid}, function(err,result){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> buyer -> getCurrentOrders ");
                res.writeHead(404);
                res.end("No orders found");
            }else{
                if(result.length > 0){
                    let orders = result;
                    let upcomingOrders = []
                    for(let order of orders){
                        let itemList = [];
                        if(order.status !== 'Delivered' && order.status !== 'Cancelled'){
                            for(let item in order['quantity']){
                                //console.log(item, order['quantity'][item]);
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
                    res.end(JSON.stringify(upcomingOrders));
                }else{
                    console.log("No orders found");
                    res.writeHead(404);
                    res.end("No orders found");
                }
            }
        });

    }else{
        console.log("Error in second if. Check Backend -> buyer -> getCurrentOrders ");
        res.writeHead(405);
        res.end("Error in validating authetication");
        
    }
};

module.exports = {
    getCurrentOrders : getCurrentOrders
}