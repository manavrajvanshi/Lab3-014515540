var database = require('../database/database.js');
var Buyer = database.Buyer;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let bid = msg.bid;
    let query = {_id:bid};
    Buyer.find(query, function(err, result){
    if(err){
        console.log('error-->');
        callback(err,"Error");
    }  
    else{
        if(result.length > 0){
            let data = result[0];
            let buyer = {
                bid : data['_id'],
                name : data['name'],
                email : data['email'],
                __v : data['__v'],
                phone : data['phone']
            }
            //console.log(buyer);
            callback(null,JSON.stringify(buyer))
        }else{
            console.log("No user with the given bid found.");
            callback(null,"You are not authenticated or user found.")
            
        }
    }
    console.log("after callback");

    });
};
exports.handle_request = handle_request;