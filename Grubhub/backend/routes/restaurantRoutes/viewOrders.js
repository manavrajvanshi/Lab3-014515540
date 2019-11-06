let kafka = require('../../kafka/client.js');

const viewOrders = (req,res) => {
    if(req.cookies.authCookieo === 'authenticated'){
        kafka.make_request('restaurant_viewOrders',req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
            }else{
                //console.log("RESPONSE: ",kafkaResult);
                if(kafkaResult == 201 ){
                    console.log("No orders found");
                    res.writeHead(201);
                    res.end("No orders found");
                }else{
                    res.end(JSON.stringify(kafkaResult));
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