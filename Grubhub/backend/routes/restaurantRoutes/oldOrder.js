const database = require('../../database/database');
const Order = database.Order;

const oldOrder = (req,res) => {

    if(req.cookies.authCookieo === 'authenticated'||1){
        let rid = req.body.rid;
        //console.log(rid);   
        Order.find({rid : rid}, function(err, result){
            if(err){
                console.log("Error in first if. Check Backend -> restaurants -> oldOrders ")
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
                    res.end(JSON.stringify(oldOrders));
                }else{
                    console.log("No orders found");
                    res.writeHead(201);
                    res.end("No orders found");
                }
            }
        });
    }else{
        console.log("Error in second if. Check Backend -> Restaurant -> oldOrders ");
        res.writeHead(405);
        res.end("Error in validating authetication");
        
    }
   
}

module.exports = {
    oldOrder : oldOrder
}