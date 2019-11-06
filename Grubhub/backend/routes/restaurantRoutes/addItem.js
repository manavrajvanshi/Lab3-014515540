let kafka = require('../../kafka/client.js');

const addItem = (req, res)=>{
    
    //console.log(name, description, price, section, rid);
    if(req.cookies.authCookieo === 'authenticated'){
        kafka.make_request('restaurant_addItem', req.body, function(err,kafkaResult){
            if(err){
                console.log("Error in first if. Check Backend -> restaurant -> addItem");
            }else{
                if(kafkaResult == 400){
                    res.writeHead(400);
                    res.end();
                    console.log(err);
                    console.log("Error in second if. Check Backend -> restaurant -> addItem ");
                }else if (kafkaResult == 200){
                    res.writeHead(200);
                    res.end();
                    console.log("Item Added");
                }
            }
        });
    }else{
        console.log("Not Authenticated (/addItem)");
        res.writeHead(400);
        res.end();
    }
}

module.exports = {
    addItem : addItem
}