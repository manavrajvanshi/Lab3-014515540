let kafka = require('../../kafka/client.js');

const updateSection = (req,res) => {
    if(req.cookies.authCookieo === 'authenticated'){
        kafka.make_request('restaurant_updateSection',req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> restaurant -> updateSection");
                res.writeHead(400);
                res.end("Section Not Updated");
            }else{
                //console.log("RESPONSE: ",kafkaResult);
                if(kafkaResult == 400 ){
                    console.log(err);
                    console.log("Error in Second if. Check Backend -> restaurant -> updateSection");
                    res.writeHead(400);
                    res.end("Section Not Updated");
                }else{
                    res.writeHead(200);
                    res.end("Section Updated");
                    console.log("Section Updated"); 
                    
                }
            }
        });
    }
};

module.exports = {
    updateSection: updateSection
}