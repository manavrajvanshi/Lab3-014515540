const database = require('../../database/database');
const Order = database.Order;

const sendChat = (req,res) => {
    //console.log("INSIDE CHAT");
    if(req.cookies.authCookieo === 'authenticated'){
        let oid = req.body.oid;
        let chatMessage = req.body.chatMessage;
        Order.findById(oid, function(err,order){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> owner -> sendChat ");
                res.writeHead(401);
                res.end();
            }else{
                if(order){
                    order.message.push({'type':'restaurant','message':chatMessage});
                    order.save(function (err, result){
                        if(err){
                            console.log("Error in Third if. Check Backend -> owner -> sendChat ");
                            res.writeHead(400);
                            res.end();
                        }else{
                            res.writeHead(200);
                            //console.log(result.message);
                            res.end(JSON.stringify(result.message));  
                        }
                    })
                }

            }
        })

    }else{
        console.log("Error in first else Check Backend -> owner -> sendChat ");
        res.writeHead(403);
        res.end();
    }
};

module.exports = {
    sendChat : sendChat
}