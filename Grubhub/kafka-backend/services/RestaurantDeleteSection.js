var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let rid = msg.rid;
    let section = msg.section;

    Restaurant.findById(rid, function(err, restaurant){
        if(err){
            console.log(err);
            console.log("Error in first if. Check kafka -> restaurant -> deleteSection");
            callback(err, 400);
        }else{
            console.log("entered here4444");
            let items = restaurant.items;
            var i = items.length-1;
            while (i>=0) {
                var item = items[i];
                if( item.section == section  ){
                    item.remove();
                }
                i--;
            }
            restaurant.save(function(err,result){
                if(err){
                    console.log(err);
                    console.log("Error in Second if. Check kafka -> restaurant -> deleteSection");
                    callback(null, 400);
                }else{
                    console.log("AFTER DELETEDD-----------",result);
                    callback(null, 200);
                }
            })
        }
    });
};
exports.handle_request = handle_request;