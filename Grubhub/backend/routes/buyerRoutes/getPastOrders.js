const database = require('../../database/database');
const Order = database.Order;

const getPastOrders = (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'||1){
        let bid = req.body.bid;
        // console.log(query);
        Order.find({bid:bid}, function(err,result){
            if(err){
                console.log(err);
                console.log("No orders found");
                res.writeHead(404);
                res.end("No orders found");
            }else{
                if(result.length > 0){
                    //console.log(result);
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
                    console.log(oldOrders);
                    res.end(JSON.stringify(oldOrders));
                }else{
                    console.log("No orders found");
                    res.writeHead(404);
                    res.end("No orders found");
                }
            }
        });
      

    }else{
        console.log("Error in second if. Check Backend -> buyer -> getPastOrders ");
        res.writeHead(405);
        res.end("Error in validating authetication");
        
    }
};

module.exports = {
    getPastOrders : getPastOrders
}