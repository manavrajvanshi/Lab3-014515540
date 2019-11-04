const bcrypt = require('bcrypt');
const database = require('../../database/database');
const Buyer = database.Buyer;

const update = (req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let bid = req.body.bid;
    let selfFlag = false;
    let query = {_id:bid};
    Buyer.find(query, function (err,result){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> update ");
        }else{
            
            if(result.length > 0 ){
                if( result[0].email === email){
                    selfFlag = true;
                }else{
                    selfFlag = false;
                }
            }else{
                selfFlag = false;
            }
        }
    });
    bcrypt.hash(password, 10).then(function(hashedPassword){
        let query = {email:email};
        Buyer.find(query, function (err, result){
            if(err){
                console.log("Error in first if. Check Backend -> Buyer -> update ");
            }else{
                console.log("Checking if email exists in buyers table.");

                if(result.length == 0 || selfFlag){
                    let query = {_id:bid};
                    let buyer = {name:name, email:email, password:hashedPassword, phone:phone};
                    Buyer.findOneAndUpdate(query, buyer, {new : true}, function(err,result){
                        if(err){
                            console.log("Error in if 2, Check Backend -> Buyer -> update ");
                            res.writeHead(201);
                            res.end("Records not updated, Error in if 2, Check Backend -> Buyer -> update.");
                        }else{
                            console.log("Profile Updated");
                            console.log(result);
                            let buyer = {
                                bid : result['_id'],
                                name : result['name'],
                                email : result['email'],
                                __v : result['__v'],
                                phone : result['phone']
                            }
                            res.cookie('authCookieb', 'authenticated');
                            res.cookie('userType', 'buyer');
                            res.cookie('userId', 'buyer:'+buyer['bid']);
                            res.cookie('buyerData',JSON.stringify(buyer),{encode:String});
                            res.writeHead(200);
                            res.end("Records Updated");
                        }
                    });
                }else{
                    console.log("Email belongs to someone else");
                    res.writeHead(202);
                    res.end("Email Belongs to someone else.");
                }
            }
        });
   
    }).catch(error => console.log(error));
}

module.exports = {
    update:update
}