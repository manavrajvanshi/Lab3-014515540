let kafka = require('../../kafka/client.js');

const sendChat = (req,res) => {
    //console.log("INSIDE CHAT");
    if(req.cookies.authCookieo === 'authenticated'){
        kafka.make_request('restaurant_sendChat',req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> owner -> sendChat ");
                res.writeHead(401);
                res.end();
            }else{
                //console.log("RESPONSE: ",kafkaResult);
                if(kafkaResult == 400 ){
                    console.log("Error in Third if. Check Backend -> owner -> sendChat ");
                    res.writeHead(400);
                    res.end();
                }else{
                    res.writeHead(200);
                    res.end(JSON.stringify(kafkaResult.message)); 
                }
            }
        });
    }else{
        console.log("Error in first else Check Backend -> owner -> sendChat ");
        res.writeHead(403);
        res.end();
    }
};

module.exports = {
    sendChat : sendChat
}