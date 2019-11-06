let kafka = require('../../kafka/client.js');

const searchItem = (req,res) =>{
    kafka.make_request('buyer_searchItem',req.body, function(err,kafkaResult){
        if(err){
            console.log(err);
            console.log("Error in first if. Check Backend -> Buyer -> searchItem ");
            res.writeHead(202);
            res.end("Sorry, We're closed!");
        }else{
            console.log("RESPONSE: ",kafkaResult);
            if(kafkaResult == 202 ){
                res.writeHead(202);
                console.log("Item not available at any of the restaurants!");
                res.end("Item not found at any of the restaurants!");
            }else{
                res.writeHead(200);
                res.end(JSON.stringify(kafkaResult))
            }
        }
    });
};

module.exports = {
    searchItem : searchItem
}