var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let searchItem = msg.searchItem;
    Restaurant.find( {}, function(err,restaurants){
        if(err){
            console.log(err);
            console.log("Error in first if. Check Kafka -> Buyer -> searchItem ");
            callback(err, 202);
        }else{
            let restaurantResult = [];
            for(let restaurant of restaurants){
                let items = restaurant.items;
                for( let item of items){
                    if(item.name == searchItem){
                        restaurantResult.push(
                            {
                                rid : restaurant._id,
                                restaurantName : restaurant.restaurantName,
                                cuisine : restaurant.cuisine
                            }
                        );
                    }
                }
            }
            if(restaurantResult.length == 0 ){
                callback(null, 202);
            }else{
                callback(null,restaurantResult);
            }
        }
    });
};
exports.handle_request = handle_request;