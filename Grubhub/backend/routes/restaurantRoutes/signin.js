const bcrypt = require('bcrypt');
const database = require('../../database/database');
const Restaurant = database.Restaurant;
const jwt = require('jsonwebtoken'); 

const signin = (req, res)=> {
    let email = req.body.email;
    let password = req.body.password;
    let query = {ownerEmail:email};
    Restaurant.find(query, function(err, result){
        if(err){
            res.writeHead(203);
            res.end();
            console.log("Error in first if. Check Backend -> Restaurant -> Signin ");
        }else{
            if(result.length > 0 ){
                let data = result[0];
                //console.log(data);
                let hashedPassword = data['ownerPassword'];
                console.log("ownerEmail matched, checking for password!");
                bcrypt.compare(password, hashedPassword).then(function(matched) {
                    if(matched){
                        let owner = {
                            rid: data['_id'],
                            ownerName: data['ownerName'],
                            ownerEmail: data['ownerEmail'],
                            ownerPhone: data['ownerPhone'],
                            restaurantName: data['restaurantName'],
                            restaurantZip: data['restaurantZip'],
                            cuisine : data['cuisine'],
                            __v : data['__v']
                        }

                        res.cookie('authCookieo', 'authenticated');
                        res.cookie('userType', 'owner');
                        res.cookie('rid', JSON.stringify(owner['rid']),{encode:String});
                        // console.log("OWNER RID");
                        // console.log(JSON.stringify(owner['rid']),{encode:String});
                        res.cookie('ownerData',JSON.stringify(owner),{encode:String});
                        let token = jwt.sign({rid : owner['rid']}, "HashString");
                        //console.log("Token: "+token);
                        res.setHeader("Access-Control-Expose-Headers","Authorization");
                        res.header({"Authorization": 'owner '+token});
                        res.writeHead(200);
                        res.end("Signed in successfully");
                        console.log("Owner Signed in");
                        //console.log(owner);
                    }
                    else{
                        res.writeHead(201);
                        res.end("Incorrect Password");
                        console.log("Incorrect Password");
                    }
                }).catch(decryptionError => console.log(decryptionError));
            }else{
                res.writeHead(202);
                console.log("No user with the given email found.");
                res.end("No user with the given email found.");
            }    
        }
    });
};

module.exports = {
    signin : signin
}