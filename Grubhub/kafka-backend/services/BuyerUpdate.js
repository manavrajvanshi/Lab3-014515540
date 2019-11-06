const bcrypt = require('bcrypt');
var database = require('../database/database.js');
const Buyer = database.Buyer;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
   // console.log(JSON.stringify(msg));
    let name = msg.name;
    let email = msg.email;
    let password = msg.password;
    let phone = msg.phone;
    let bid = msg.bid;
    let selfFlag = false;
    let query = {_id:bid};
    Buyer.find(query, function (err,result){
        if(err){
            console.log("Error in first if. Check Kafka -> Buyer -> update ");
        }else{
            
            if(result.length > 0 ){
                if( result[0].email === email){
                    selfFlag = true;
                }else{
                    selfFlag = false;
                }
            }else{
                selfFlag = false;
            }
        }
    });
    bcrypt.hash(password, 10).then(function(hashedPassword){
        let query = {email:email};
        Buyer.find(query, function (err, result){
            if(err){
                console.log("Error in first if bcrypt. Check Kafka -> Buyer -> update ");
            }else{
                console.log("Checking if email exists in buyers table.");

                if(result.length == 0 || selfFlag){
                    let query = {_id:bid};
                    let buyer = {name:name, email:email, password:hashedPassword, phone:phone};
                    Buyer.findOneAndUpdate(query, buyer, {new : true}, function(err,result){
                        if(err){
                            console.log("Error in if 2, Check Backend -> Buyer -> update ");
                            callback(null, 201);
                        }else{
                            console.log("Profile Updated");
                            //console.log(result);
                            let buyer = {
                                bid : result['_id'],
                                name : result['name'],
                                email : result['email'],
                                __v : result['__v'],
                                phone : result['phone']
                            }
                            callback(null, buyer);
                        }
                    });
                }else{
                    console.log("Email belongs to someone else");
                    callback(null, 202);
                }
            }
        });
   
    }).catch(error => console.log(error));
};
exports.handle_request = handle_request;