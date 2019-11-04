const database = require('../../database/database');
const Order = database.Order;

const placeOrder = (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
    Order.create(req.body, function(err,result){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> buyer -> placeOrder ");
                res.writeHead(401);
                res.end();
            }else{
                console.log("Order Placed");
                res.end("Order Placed");
                //console.log(result);
            }
        });
        // console.log(req.body);
    }else{
        console.log("Error in third if. Check Backend -> buyer -> placeOrder ");
        res.writeHead(403);
        res.end();
    }
};

module.exports = {
    placeOrder : placeOrder
}