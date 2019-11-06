var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    Restaurant.findById(msg, function(err, result){
        if(err){
            console.log(err);
            console.log("Error in first if. Check kafka -> restaurant -> menu ")
        }else{
            if(result){
                let items = result.items;

                console.log("ITEM ARR: ",result);
                callback(null, items);
            }else{
                console.log("No items stored");
                console.log(result);
                callback(null,"No items stored");
            }
        }
    });
};
exports.handle_request = handle_request;