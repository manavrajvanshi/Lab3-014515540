let kafka = require('../../kafka/client.js');

const home = (req, res)=> {
    kafka.make_request('restaurant_home',req.body, function(err,kafkaResult){
        if(err){
            console.log("Error in first if. Check Backend -> Owner -> HOME ")
        }else{
            res.send(kafkaResult);
        }
    });  
}

module.exports = {
    home:home
}