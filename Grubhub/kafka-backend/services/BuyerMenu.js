var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let rid = msg.rid;
    Restaurant.find( {_id:rid}, function(err,result){
        if(err){
            callback(err,404);
            console.log("Error in first if. Check Kafka -> buyer -> menu ");
        }else{
            if(result.length > 0 ){
                let items = result[0].items;
                let data = [];
                for( let item of items){
                    data.push({
                        iid: item['_id'],
                        name: item['name'],
                        description: item['description'],
                        section: item['section'],
                        price: item['price']
                    })
                }
                callback(null, data);
            }else{
                callback(err,404);
            }
        }
    });
};
exports.handle_request = handle_request;