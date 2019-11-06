let kafka = require('../../kafka/client.js');

const menu = (req,res) => {
    if(req.cookies.authCookieo === 'authenticated'){
        let ownerData = req.cookies.ownerData;
        let rid = JSON.parse(ownerData).rid;
        kafka.make_request('restaurant_menu', rid, function(err,kafkaResult){
            if(err){
                console.log("Error in first if. Check Backend -> restaurant -> menu ")
            }else{
                res.send(kafkaResult);
            }
        });
        
    }else{
        console.log("Not Authenticated (Backend / Restaurant / menu)");
        res.writeHead(405);
    }
};

module.exports = {
    menu : menu
}