const bcrypt = require('bcrypt');
const database = require('../../database/database');
const Buyer = database.Buyer;

const signup = (req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    
    bcrypt.hash(password, 10).then(function(hashedPassword){

        let query = {email : email};
        
        Buyer.find(query, function(err,result){
            if(err){
                console.log("Error in first if. Check Backend -> Buyer -> Signup ");
                res.writeHead(400);
                res.end("Something Happened LOL");
            }else{
                let x = result.length;
                console.log("Checking if email exists in buyers table.");
                if( x == 0){
                    console.log("Entering the new details of buyer.");
                    let buyer = new Buyer({name : name, email : email, password : hashedPassword});
                    buyer.save( function(err, result){
                        if(err){
                            res.writeHead(201);
                            res.end("Error second if. Check Backend -> Buyer -> Signup ");
                        }else{
                            //console.log(`${buyer} signed up`);
                            res.writeHead(200);
                            res.end("Sucessfully Signed Up!");
                        }
                    });
                }else{
                    console.log("Email already exists in the table, buyer data not entered.");
                    res.writeHead(202);
                    res.end("This account already exists.");
                }
            }
        });
    });
}

module.exports = {
    signup : signup
}