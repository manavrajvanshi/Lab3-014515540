let kafka = require('../../kafka/client.js');
const getPastOrders = (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
        kafka.make_request('buyer_getPastOrders',req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
                console.log("No orders found");
                res.writeHead(404);
                res.end("No orders found");
            }else{
                if(kafkaResult == 404){
                    console.log("No orders found");
                    res.writeHead(404);
                    res.end("No orders found");
                }else{
                    let oldOrders = kafkaResult;
                    res.end(JSON.stringify(oldOrders));
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