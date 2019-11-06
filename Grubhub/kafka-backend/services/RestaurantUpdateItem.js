var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let name = msg.nameUpdate;
    let description = msg.descriptionUpdate;
    let price = msg.priceUpdate;
    let section = msg.sectionUpdate;
    let iid = msg.iid;
    let rid = msg.rid;

    Restaurant.findById(rid, function(err, restaurant){
        if(err){
          console.log(err);
          console.log("Error in first if. Check kafka -> restaurant -> updateItem");
          callback(err,400);
        }else{
            //console.log(restaurant);
            let items = restaurant.items;
            for(let item of items){     
                if( item._id == iid  ){
                    item.name = name;
                    item.description = description;
                    item.section = section;
                    item.price = price;
                    break;
                }
            }
            restaurant.save(function(err,result){
                if(err){
                    console.log(err);
                    console.log("Error in Second if. Check Backend -> restaurant -> updateItem");
                    callback(null, 400);
                }else{
                    //console.log(result);
                    console.log("Item Updated"); 
                    callback(null, 200);
                }
            })
        }
    });
};
exports.handle_request = handle_request;