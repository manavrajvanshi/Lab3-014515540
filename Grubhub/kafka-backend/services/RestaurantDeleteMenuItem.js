var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let iid = msg.iid;
    let rid = msg.rid;

    Restaurant.findById(rid, function(err, restaurant){
        if(err){
            
            console.log("Error in first if. Check Kafka -> restaurant -> deleteMenuItem");
            callback(err,500);
        }else{
            //console.log(restaurant);
            let items = restaurant.items;
            for(let item of items){     
                if( item._id == iid  ){
                    item.remove();
                    break;
                }
            }
            restaurant.save(function(err,result){
                if(err){
                    console.log(err);
                    console.log("Error in Second if. Check Kafka -> restaurant -> deleteMenuItem");
                    callback(null,500);
                }else{
                    //console.log(result);
                    console.log("Item Deleted"); 
                    callback(null, 200);
                }
            })
        }
    });
};
exports.handle_request = handle_request;