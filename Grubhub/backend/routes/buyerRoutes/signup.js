let kafka = require('../../kafka/client.js');

const signup = (req,res) =>{
    kafka.make_request('buyer_signup',req.body, function(err,kafkaResult){
        if(err){
            console.log("Error in first if. Check Backend -> Buyer -> Signup ");
            res.writeHead(400);
            res.end("Something Happened LOL");
        }else{
            if(kafkaResult == 201){
                res.writeHead(201);
                res.end("Error second if. Check Backend -> Buyer -> Signup ");
            }else if(kafkaResult == 202){
                console.log("Email already exists in the table, buyer data not entered.");
                res.writeHead(202);
                res.end("This account already exists.");
            }else{
                res.writeHead(200);
                res.end("Sucessfully Signed Up!");
            }
        }
    });  
}

module.exports = {
    signup : signup
}