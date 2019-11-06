let kafka = require('../../kafka/client.js');

const update = (req,res) =>{
    kafka.make_request('buyer_update',req.body, function(err,kafkaResult){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> Signup ");
            res.writeHead(400);
            res.end("Something Happened LOL");
        }else{
            if(kafkaResult == 201){
                console.log("Error in if 2, Check Backend -> Buyer -> update ");
                res.writeHead(201);
                res.end("Records not updated, Error in if 2, Check Backend -> Buyer -> update.");
            }else if(kafkaResult == 202){
                console.log("Email belongs to someone else");
                res.writeHead(202);
                res.end("Email Belongs to someone else.");
            }else{
                let buyer = kafkaResult;
                let cookieObj ={
                    'authCookieb'   :'authenticated',
                    'userType'      :'buyer',
                    'userId'        :'buyer:'+buyer['bid'],
                    'buyerData'     :JSON.stringify(buyer),

                }
                // res.cookie('authCookieb', 'authenticated');
                // res.cookie('userType', 'buyer');
                // res.cookie('userId', 'buyer:'+buyer['bid']);
                // res.cookie('buyerData',JSON.stringify(buyer),{encode:String});
                res.writeHead(200);
                res.end(JSON.stringify(cookieObj));
            }
        }
    });
    
}

module.exports = {
    update:update
}