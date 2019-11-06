var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let name = msg.name;
    let description = msg.description;
    let price = msg.price;
    let section = msg.section;
    let rid = msg.rid;
    Restaurant.findById(rid, function(err, result){
        if(err){
            console.log(err);
            console.log("Error in first if. Check kafka -> restaurant -> addItem ");
            callback(err,400);
        }else{
            let restaurant = result;
            let item = {
                name: name,
                description : description,
                section : section,
                price: price,
                rid : rid
            };
            restaurant.items.push(item);
            restaurant.save( function(err,result){
                if(err){
                    console.log(err);
                    console.log("Error in second if. Check Kafka -> restaurant -> addItem ");
                    callback(null,400);
                }else{
                    console.log("Item Added");
                    callback(null,200);
                }
            });
        }
    });
};
exports.handle_request = handle_request;