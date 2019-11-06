let kafka = require('../../kafka/client.js');

const updateItem = (req,res) =>{

    kafka.make_request('restaurant_updateItem',req.body, function(err,kafkaResult){
        if(err){
            console.log(err);
            console.log("Error in first if. Check Backend -> restaurant -> updateItem");
            res.writeHead(400);
            res.end("Item Not Updated");
        }else{
            //console.log("RESPONSE: ",kafkaResult);
            if(kafkaResult == 400 ){
                console.log(err);
                console.log("Error in Second if. Check Backend -> restaurant -> updateItem");
                res.writeHead(400);
                res.end("Item Not Updated");
            }else{
                res.writeHead(200);
                res.end("Item Updated");
                console.log("Item Updated");
                
            }
        }
    });
}

module.exports = {
    updateItem:updateItem
}