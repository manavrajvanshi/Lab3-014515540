let kafka = require('../../kafka/client.js');
const jwt = require('jsonwebtoken');
const signin = (req, res)=> {
    //console.log("OKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKOKO",req.header.origin);
    kafka.make_request('buyer_signin',req.body, function(err,kafkaResult){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> Signin ");
            res.writeHead(400);
            res.end("Error");
        }else{
            if(kafkaResult == 201){
                res.end("Incorrect Password");
                console.log("Incorrect Password");
            }else if(kafkaResult == 202){
                res.writeHead(202);
                console.log("No user with the given email found.");
                res.end("No user with the given email found.");
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
                let token = jwt.sign({bid : buyer['bid']}, "HashString");
                console.log("Token: "+token);
                res.setHeader("Access-Control-Expose-Headers","Authorization");
                res.header({"Authorization": 'buyer '+token});
                res.writeHead(200);
                res.end(JSON.stringify(cookieObj));
                console.log("Logged In");

            }
        }
    });  
    
}

module.exports = {
    signin : signin
}