const database = require('../../database/database');
const Restaurant = database.Restaurant;

const home = (req, res)=> {
    let rid = req.body.rid;
    let query = { _id: rid};
    Restaurant.find(query, function(err,result){
        if(err){
            console.log("Error in first if. Check Backend -> owner -> HOME ")
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
                res.end(JSON.stringify(owner));    
            }else{
                console.log("No user with the given rid found.");
                res.end("You are not authenticated or user not found.");
            }     
        }
    }); 
}

module.exports = {
    home:home
}