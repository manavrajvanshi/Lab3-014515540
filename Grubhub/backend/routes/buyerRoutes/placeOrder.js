let kafka = require('../../kafka/client.js');
const placeOrder = (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
    kafka.make_request('buyer_placeOrder',req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
                console.log("Error in first if, Check Backend -> buyer -> menu");
                res.writeHead(404);
                res.end("OOPS!! The restaurant is closed.");
            }else{
                res.end(kafkaResult);
            }
        });
    }else{
        console.log("Error in third if. Check Backend -> buyer -> placeOrder ");
        res.writeHead(403);
        res.end();
    }
};

module.exports = {
    placeOrder : placeOrder
}