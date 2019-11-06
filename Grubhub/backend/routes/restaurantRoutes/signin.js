const jwt = require('jsonwebtoken'); 
let kafka = require('../../kafka/client.js');

const signin = (req, res)=> {
    kafka.make_request('restaurant_signin',req.body, function(err,kafkaResult){
        if(err){
            res.writeHead(203);
            res.end();
            console.log("Error in first if. Check Backend -> Restaurant -> Signin ");
        }else{
            if(kafkaResult == 201){
                res.writeHead(201);
                res.end("Incorrect Password");
                console.log("Incorrect Password");
            }else if(kafkaResult == 202){
                res.writeHead(202);
                console.log("No user with the given email found.");
                res.end("No user with the given email found.");
            }else{
                let owner = kafkaResult;
                let cookieObj ={
                    'authCookieo'   :'authenticated',
                    'userType'      :'owner',
                    'rid'           :owner['rid'],
                    'ownerData'     :JSON.stringify(owner)
                }
                // res.cookie('authCookieo', 'authenticated');
                // res.cookie('userType', 'owner');
                // res.cookie('rid', JSON.stringify(owner['rid']),{encode:String});
                // // console.log("OWNER RID");
                // // console.log(JSON.stringify(owner['rid']),{encode:String});
                // res.cookie('ownerData',JSON.stringify(owner),{encode:String});
                let token = jwt.sign({rid : owner['rid']}, "HashString");
                //console.log("Token: "+token);
                res.setHeader("Access-Control-Expose-Headers","Authorization");
                res.header({"Authorization": 'owner '+token});
                res.writeHead(200);
                res.end(JSON.stringify(cookieObj));
                console.log("Owner Signed in");
                //console.log(owner);
            }
        }
    });
};

module.exports = {
    signin : signin
}