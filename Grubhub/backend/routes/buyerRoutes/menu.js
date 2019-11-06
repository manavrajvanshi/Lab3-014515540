let kafka = require('../../kafka/client.js');

const menu = (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
        kafka.make_request('buyer_menu',req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
                console.log("Error in first if, Check Backend -> buyer -> menu");
                res.writeHead(404);
                res.end("OOPS!! The restaurant is closed.");
            }else{
                if(kafkaResult == 404 ){
                    console.log("No Items found at this restaurant.");
                    res.writeHead(404);
                    res.end("OOPS!! The restaurant is closed or out of items.");
                }else{
                    res.end(JSON.stringify(kafkaResult));
                }
            }
        });
    }else{
        console.log("Error in second if. Check Backend -> buyer -> menu ");
        res.writeHead(405);
        
    }
};

module.exports = {
    menu : menu
}