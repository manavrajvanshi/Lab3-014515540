const bcrypt = require('bcrypt');
const database = require('../../database/database');
const Restaurant = database.Restaurant;

const update = (req,res) =>{
    let ownerName = req.body.ownerName;
    let ownerEmail = req.body.ownerEmail;
    let ownerPassword = req.body.ownerPassword;
    let ownerPhone = req.body.ownerPhone;
    let rid = req.body.rid;
    let restaurantName = req.body.restaurantName;
    let restaurantZip = req.body.restaurantZip;
    let cuisine = req.body.cuisine;
    let selfFlag = false;
    let query = {_id:rid};
    Restaurant.find(query, function(err,result){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> update ");
        }else{
            if(result.length > 0 ){
                if( result[0].ownerEmail === ownerEmail){
                    selfFlag = true;
                }else{
                    selfFlag = false;
                }
            }else{
                selfFlag = false;
            }
        }
    });
    bcrypt.hash(ownerPassword, 10).then(function(hashedPassword){
        let query = {ownerEmail:ownerEmail};
        Restaurant.find(query, function(err,result){
            if(err){
                console.log("Error in first if. Check Backend -> restaurant -> update ");
                res.writeHead(201);
                res.end("Data not updated, Error in first if. Check Backend -> restaurant -> update.")
            }else{
                console.log("Checking if email exists in restaurants table.");
                if(result.length == 0 || selfFlag){
                    let query = {_id:rid};
                    let owner = {
                        ownerName: ownerName,
                        ownerEmail: ownerEmail,
                        ownerPassword: hashedPassword,
                        ownerPhone: ownerPhone,
                        restaurantName: restaurantName,
                        restaurantZip: restaurantZip,
                        cuisine: cuisine
                    };
                    Restaurant.findOneAndUpdate(query,owner,{new:true}, function(err,result){
                        if(err){
                            res.writeHead(202);
                            res.end("Error in if 2, Check Backend -> restaurant -> update ")
                            console.log("Error in if 2, Check Backend -> restaurant -> update ")
                        }else{
                            console.log(result);
                            let data = result;
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
                            res.cookie('authCookieo', 'authenticated');
                            res.cookie('userType', 'owner');
                            res.cookie('rid', owner['rid']);
                            res.cookie('ownerData',JSON.stringify(owner),{encode:String});
                            res.writeHead(200);
                            res.end("Records Updated");
                        }
                    });
                }else{
                    console.log("Email already exists in the table, owner data not Updated.");
                    res.writeHead(203);
                    res.end("Email Belongs to another account.");
                }
            }
        });
    }).catch(error => console.log(error));
};

module.exports = {
    update : update
}