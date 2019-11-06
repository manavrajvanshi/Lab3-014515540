let kafka = require('../../kafka/client.js');

const update = (req,res) =>{
    kafka.make_request('restaurant_update',req.body, function(err,kafkaResult){
        if(err){
            console.log("Error in first if. Check Backend -> restaurant -> update ");
            res.writeHead(201);
            res.end("Data not updated, Error in first if. Check Backend -> restaurant -> update.");
        }else{
            if(kafkaResult == 201){
                console.log("Error in first if. Check Backend -> restaurant -> update ");
                res.writeHead(201);
                res.end("Data not updated, Error in first if. Check Backend -> restaurant -> update.");
            }else if(kafkaResult == 202){
                res.writeHead(202);
                res.end("Error in if 2, Check Backend -> restaurant -> update ")
                console.log("Error in if 2, Check Backend -> restaurant -> update ")
            }else if (kafkaResult == 203){
                console.log("Email already exists in the table, owner data not Updated.");
                res.writeHead(203);
                res.end("Email Belongs to another account.");
            }else{
                let owner = kafkaResult;
                res.cookie('authCookieo', 'authenticated');
                res.cookie('userType', 'owner');
                res.cookie('rid', owner['rid']);
                res.cookie('ownerData',JSON.stringify(owner),{encode:String});
                res.writeHead(200);
                res.end("Records Updated");
            }
        }
    });
};

module.exports = {
    update : update
}