const bcrypt = require('bcrypt');
var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let ownerName = msg.ownerName;
    let ownerEmail = msg.ownerEmail;
    let ownerPassword = msg.ownerPassword;
    let ownerPhone = msg.ownerPhone;
    let rid = msg.rid;
    let restaurantName = msg.restaurantName;
    let restaurantZip = msg.restaurantZip;
    let cuisine = msg.cuisine;
    let selfFlag = false;
    let query = {_id:rid};
    Restaurant.find(query, function(err,result){
        if(err){
            console.log("Error in first if. Check Kafka -> Restaurant -> update ");
        }else{
            if(result.length > 0 ){
                if( result[0].ownerEmail === ownerEmail){
                    selfFlag = true;
                }else{
                    selfFlag = false;
                }
            }else{
                selfFlag = false;
            }
        }
    });
    bcrypt.hash(ownerPassword, 10).then(function(hashedPassword){
        let query = {ownerEmail:ownerEmail};
        Restaurant.find(query, function(err,result){
            if(err){
                callback(null, 201);
            }else{
                console.log("Checking if email exists in restaurants table.");
                if(result.length == 0 || selfFlag){
                    let query = {_id:rid};
                    let owner = {
                        ownerName: ownerName,
                        ownerEmail: ownerEmail,
                        ownerPassword: hashedPassword,
                        ownerPhone: ownerPhone,
                        restaurantName: restaurantName,
                        restaurantZip: restaurantZip,
                        cuisine: cuisine
                    };
                    Restaurant.findOneAndUpdate(query,owner,{new:true}, function(err,result){
                        if(err){
                            callback(null, 202);
                            console.log("Error in if 2, Check Backend -> restaurant -> update ")
                        }else{
                            console.log(result);
                            let data = result;
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
                            callback(null, owner);
                        }
                    });
                }else{
                    console.log("Email already exists in the table, owner data not Updated.");
                    callback(null, 203);
                }
            }
        });
    }).catch(error => console.log(error));
};
exports.handle_request = handle_request;