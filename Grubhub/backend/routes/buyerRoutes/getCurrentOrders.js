let kafka = require('../../kafka/client.js');
const getCurrentOrders = (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
        kafka.make_request('buyer_getCurrentOrders',req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> buyer -> getCurrentOrders ");
                res.writeHead(404);
                res.end("No orders found");
            }else{
                if(kafkaResult == 404){
                    console.log("No orders found");
                    res.writeHead(404);
                    res.end("No orders found");
                }else{
                    let upcomingOrders = kafkaResult;
                    res.end(JSON.stringify(upcomingOrders));
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