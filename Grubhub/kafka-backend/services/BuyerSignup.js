const bcrypt = require('bcrypt');
var database = require('../database/database.js');
const Buyer = database.Buyer;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let name = msg.name;
    let email = msg.email;
    let password = msg.password;
    
    bcrypt.hash(password, 10).then(function(hashedPassword){

        let query = {email : email};
        
        Buyer.find(query, function(err,result){
            if(err){
                console.log("Error in first if. Check Kafka -> Buyer -> Signup ");
                callback(err,400);
            }else{
                let x = result.length;
                // console.log("RESULTTTT----");
                // console.log(x);
                console.log("Checking if email exists in buyers table.");
                if( x == 0){
                    console.log("Entering the new details of buyer.");
                    let buyer = new Buyer({name : name, email : email, password : hashedPassword});
                    buyer.save( function(err, result){
                        if(err){
                            callback(null, 201);
                        }else{
                            //console.log(`${buyer} signed up`);
                            callback(null, 200);
                        }
                    });
                }else{
                    console.log("Email already exists in the table, buyer data not entered.");
                    callback(null,202);
                }
            }
        });
    });
};
exports.handle_request = handle_request;