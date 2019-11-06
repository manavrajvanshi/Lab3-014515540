let kafka = require('../../kafka/client.js');


const deleteSection = (req,res) =>{
    if(req.cookies.authCookieo === 'authenticated'){
        kafka.make_request('restaurant_deleteSection', req.body, function(err,kafkaResult){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> restaurant -> deleteSection");
                res.writeHead(400);
                res.end("Section not deleted");
            }else{
                if(kafkaResult == 400){
                    console.log(err);
                    console.log("Error in Second if. Check Backend -> restaurant -> deleteSection");
                    res.writeHead(400);
                    res.end("Section Not Deleted");
                }else if (kafkaResult == 200){
                    res.writeHead(200);
                    res.end("Section Deleted");
                    console.log("Section Deleted");
                }
            }
        });
    }else{
        res.redirect(reactAddress + 'ownerLogin');
    }
};

module.exports = {
    deleteSection : deleteSection
}