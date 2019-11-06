const bcrypt = require('bcrypt');
var database = require('../database/database.js');
const Buyer = database.Buyer;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let email = msg.email;
    let password = msg.password;
    let query = {email : email};
    Buyer.find(query, function(err, result){
        if(err){
            console.log("Error in first if. Check Kafka -> Buyer -> Signin ");
            callback(err,"400");
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
                        callback(null,buyer);
                        console.log("Logged In");
                    }else{
                        callback(null,201);
                        console.log("Incorrect Password");
                    }
                }).catch(decryptionError => {console.log(decryptionError);callback(null, 400);});
            }else{
                callback(null, 202);
                console.log("No user with the given email found.");
                
            }
        }
    });
};
exports.handle_request = handle_request;