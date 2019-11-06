let kafka = require('../../kafka/client.js');

const deleteMenuItem = (req,res) => {
    if( req.cookies.authCookieo === 'authenticated'){
        kafka.make_request('restaurant_deleteMenuItem', req.body, function(err,kafkaResult){
            if(err){
                console.log("Error in first if. Check Backend -> restaurant -> addItem");
            }else{
                if(kafkaResult == 500){
                    console.log(err);
                        console.log("Error in Second if. Check Backend -> restaurant -> deleteMenuItem");
                        res.writeHead(500);
                        res.end();
                }else if (kafkaResult == 200){
                    res.writeHead(200);
                    res.end();
                    console.log("Item Deleted"); 
                }
            }
        });
    }
}

module.exports = {
    deleteMenuItem : deleteMenuItem
}