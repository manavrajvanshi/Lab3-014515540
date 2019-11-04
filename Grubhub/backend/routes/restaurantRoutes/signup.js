const bcrypt = require('bcrypt');
const database = require('../../database/database');
const Restaurant = database.Restaurant;

const signup = (req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let restaurantName = req.body.restaurantName;
    let restaurantZip = req.body.restaurantZip;
    
    bcrypt.hash(password, 10).then(function(hashedPassword){

        let query = {ownerEmail : email};
        Restaurant.find(query, function(err,result){
            if(err){
                console.log("Error in first if. Check Backend -> Owner -> Signup \n ");
                res.writeHead(400);
                res.send("Error");
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
                            res.writeHead(201);
                            res.end("Error:  Check Backend -> Restaurant -> SignUp (2nd If)");
                        }else{
                            console.log("Signed up");
                            res.writeHead(200);
                            res.end("Signed up sucessfully");
                        }
                    });
                }else{
                    console.log("Email already exists in the table, owner data not entered.");
                    res.writeHead(202)
                    res.end("Account Already Exists");
                }
            }
        });
    }).catch(passwordHashFailure => console.log(passwordHashFailure));
}

module.exports = {
    signup : signup
}