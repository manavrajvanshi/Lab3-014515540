const bcrypt = require('bcrypt');
var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let email = msg.email;
    let password = msg.password;
    let query = {ownerEmail:email};
    Restaurant.find(query, function(err, result){
        if(err){
            callback(err,203);
            console.log("Error in first if. Check Kafka -> Restaurant -> Signin ");
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

                        callback(null,owner);
                    }
                    else{
                        callback(null, 201);
                        console.log("Incorrect Password");
                    }
                }).catch(decryptionError => console.log(decryptionError));
            }else{
                console.log("No user with the given email found.");
                callback(null, 202);
            }    
        }
    });
};
exports.handle_request = handle_request;