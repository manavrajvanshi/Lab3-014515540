const database = require('../../database/database');
const Buyer = database.Buyer;

const home = (req, res)=> {
    let bid = req.body.bid;
    let query = {_id:bid};
    Buyer.find(query, function(err, result){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> HOME ")
        }else{
            if(result.length > 0){
                let data = result[0];
                let buyer = {
                    bid : data['_id'],
                    name : data['name'],
                    email : data['email'],
                    __v : data['__v'],
                    phone : data['phone']
                }
                //console.log(buyer);
                res.send(JSON.stringify(buyer));   
            }else{
                console.log("No user with the given bid found.");
                res.end("You are not authenticated or user found.");
            }
        }
    });  
};

module.exports = {
    home : home
}