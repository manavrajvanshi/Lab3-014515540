let kafka = require('../../kafka/client.js');

const oldOrder = (req,res) => {

    if(req.cookies.authCookieo === 'authenticated'){
        kafka.make_request('restaurant_oldOrders', req.body, function(err,kafkaResult){
            if(err){
                console.log("Error in first if. Check Backend -> restaurants -> oldOrders ")
            }else{
                console.log("KAFKAAAAA RESULTTTT 9090:",kafkaResult);
                if(kafkaResult == 201){
                    console.log("No orders found");
                    res.writeHead(201);
                    res.end("No orders found");
                }else{
                    res.end(JSON.stringify(kafkaResult));
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