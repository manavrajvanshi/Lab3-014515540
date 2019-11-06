let kafka = require('../../kafka/client.js');

const updateStatus = (req,res) =>{
    if(req.cookies.authCookieo === 'authenticated'){
        kafka.make_request('restaurant_updateStatus',req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
                console.log("Error in Second if. Check Backend -> restaurant -> updateStatus ");
                res.writeHead(400);
                res.end("Status Not Updated");
            }else{
                //console.log("RESPONSE: ",kafkaResult);
                if(kafkaResult == 400 ){
                    console.log("Error in Third if. Check Backend -> restaurant -> updateStatus ");
                    res.writeHead(400);
                    res.end("Status Not Updated");
                }else{
                    res.writeHead(200);
                    res.end('Status Updated'); 
                }
            }
        });
    }else{
        console.log("Error in first if/else. Check Backend -> restaurant -> updateStatus ");
        res.writeHead(400);
        res.end("Status Not Updated / Not Authorized");
    }
};

module.exports = {
    updateStatus : updateStatus
}