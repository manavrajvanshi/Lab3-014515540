let kafka = require('../../kafka/client.js');

const signup = (req,res) =>{
    kafka.make_request('restaurant_signup',req.body, function(err,kafkaResult){
        if(err){
            console.log("Error in first if. Check Backend -> Owner -> Signup \n ");
            res.writeHead(400);
            res.send("Error");
        }else{
            if(kafkaResult == 201){
                console.log("Error in Second if. Check Backend -> Restaurant -> SignUp ");
                res.writeHead(201);
                res.end("Error:  Check Backend -> Restaurant -> SignUp (2nd If)");
            }else if(kafkaResult == 202){
                console.log("Email already exists in the table, owner data not entered.");
                res.writeHead(202)
                res.end("Account Already Exists");
            }else{
                console.log("Signed up");
                res.writeHead(200);
                res.end("Signed up sucessfully");
            }
        }
    });  
}

module.exports = {
    signup : signup
}