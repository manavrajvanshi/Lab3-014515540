const bcrypt = require('bcrypt');
const database = require('../../database/database');
const Buyer = database.Buyer;
const jwt = require('jsonwebtoken');

const signin = (req, res)=> {
    //console.log("INSIDEEEE");
    //console.log(JSON.stringify(req.cookies));
    let email = req.body.email;
    let password = req.body.password;

    let query = {email : email};

    Buyer.find(query, function(err, result){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> Signin ");
            res.writeHead(400);
            res.end("Error");
        }else{
            if(result.length > 0){
                console.log(result);
                let data = result[0];
                let hashedPassword = data['password'];
                console.log("Buyer matched, checking for password!");
                bcrypt.compare(password, hashedPassword).then(function(matched) {
                    if(matched){
                        let buyer = {
                            bid : data['_id'],
                            name : data['name'],
                            email : data['email'],
                            __v : data['__v'],
                            phone : data['phone']
                        };
                        res.cookie('authCookieb', 'authenticated');
                        res.cookie('userType', 'buyer');
                        res.cookie('userId', 'buyer:'+buyer['bid']);
                        res.cookie('buyerData',JSON.stringify(buyer),{encode:String});
                        let token = jwt.sign({bid : buyer['bid']}, "HashString");
                        console.log("Token: "+token);
                        res.setHeader("Access-Control-Expose-Headers","Authorization");
                        res.header({"Authorization": 'buyer '+token});
                        res.writeHead(200);
                        res.end("Logged In");
                        console.log("Logged In");
                    }else{
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
}

module.exports = {
    signin : signin
}