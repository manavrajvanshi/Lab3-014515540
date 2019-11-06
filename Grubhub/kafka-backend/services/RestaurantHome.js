var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));

    let rid = msg.rid;
    let query = { _id: rid};
    Restaurant.find(query, function(err,result){
        if(err){
            console.log('error-->');
            callback(err,"Error");
            console.log("Error in first if. Check Kafka -> owner -> HOME ")
        }else{
            if(result.length > 0){
                let data = result[0];
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
                callback(null,JSON.stringify(owner));
            }else{
                console.log("No user with the given rid found.");
                callback(null,"You are not authenticated or user found.")
            }     
        }
    }); 
};
exports.handle_request = handle_request;