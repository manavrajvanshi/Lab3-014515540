let kafka = require('../../kafka/client.js');

let sendChat = (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
        kafka.make_request('buyer_sendChat',req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> Buyer -> searchItem ");
                res.writeHead(202);
                res.end("Sorry, We're closed!");
            }else{
                console.log("RESPONSE: ",kafkaResult);
                if(kafkaResult == 400 ){
                    console.log("Error in Third if. Check Backend -> buyer -> sendChat ");
                    res.writeHead(400);
                    res.end();
                }else{
                    res.writeHead(200);
                    res.end(JSON.stringify(kafkaResult.message)); 
                }
            }
        });
    }else{
        console.log("Error in first else Check Backend -> buyer -> sendChat ");
        res.writeHead(403);
        res.end();
    }
};

module.exports = {
    sendChat : sendChat
}