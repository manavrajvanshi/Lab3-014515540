var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let rid = msg.rid;
    let oldSection = msg.oldSection;
    let newSectionName = msg.newSectionName;
    Restaurant.findById(rid, function(err, restaurant){
        if(err){
            console.log(err);
            console.log("Error in first if. Check kafka -> restaurant -> updateSection");
            callback(err, 400);
        }else{
            //console.log(restaurant);
            let items = restaurant.items;
            for(let item of items){     
                if( item.section == oldSection  ){
                    item.section = newSectionName;
                }
            }
            restaurant.save(function(err,result){
                if(err){
                    console.log(err);
                    console.log("Error in Second if. Check kafka -> restaurant -> updateSection");
                    callback(null, 400);
                }else{
                    //console.log(result);
                    console.log("Section Updated"); 
                    callback(null, 200);
                }
            })
        }
    });
};
exports.handle_request = handle_request;