const bcrypt = require('bcrypt');
var database = require('../database/database.js');
const Restaurant = database.Restaurant;

function handle_request(msg, callback){
    console.log("Inside kafka backend--------------------");
    console.log(JSON.stringify(msg));
    let name = msg.name;
    let email = msg.email;
    let password = msg.password;
    let restaurantName = msg.restaurantName;
    let restaurantZip = msg.restaurantZip;
    
    bcrypt.hash(password, 10).then(function(hashedPassword){

        let query = {ownerEmail : email};
        Restaurant.find(query, function(err,result){
            if(err){
                console.log("Error in first if. Check Kafka -> Owner -> Signup \n ");
                callback(err, 400);
            }else{
                console.log(result);
                console.log("Checking if email exists in restaurants table.");
                if(result.length == 0 ){
                    console.log("Entering the new details of owner");
                    let restaurant = new Restaurant({
                        ownerName:name,
                        ownerEmail:email,
                        ownerPassword:hashedPassword,
                        restaurantName:restaurantName,
                        restaurantZip:restaurantZip
                    });
                    restaurant.save(function(err,result){
                        if(err){
                            console.log("Error in Second if. Check Backend -> Restaurant -> SignUp ");
                            callback(null, 201);
                        }else{
                            console.log("Signed up");
                            callback(null, 200);
                        }
                    });
                }else{
                    console.log("Email already exists in the table, owner data not entered.");
                    callback(null, 202);
                }
            }
        });
    }).catch(passwordHashFailure => console.log(passwordHashFailure));
};
exports.handle_request = handle_request;