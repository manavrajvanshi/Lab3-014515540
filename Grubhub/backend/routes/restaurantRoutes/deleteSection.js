const database = require('../../database/database');
const Restaurant = database.Restaurant;

const deleteSection = (req,res) =>{
    if(req.cookies.authCookieo === 'authenticated'){
        let rid = req.body.rid;
        let section = req.body.section;

        Restaurant.findById(rid, function(err, restaurant){
            if(err){
              console.log(err);
              console.log("Error in first if. Check Backend -> restaurant -> deleteSection");
              res.writeHead(400);
              res.end("Section not deleted");
            }else{
                //console.log(restaurant);
                let items = restaurant.items;
                var i = items.length-1;
                while (i>=0) {
                    var item = items[i];
                    if( item.section == section  ){
                        item.remove();
                    }
                    i--;
                }
                restaurant.save(function(err,result){
                    if(err){
                        console.log(err);
                        console.log("Error in Second if. Check Backend -> restaurant -> deleteSection");
                        res.writeHead(400);
                        res.end("Section Not Deleted");
                    }else{
                        //console.log(result);
                        res.writeHead(200);
                        res.end("Section Deleted");
                        console.log("Section Deleted"); 
                    }
                })
            }
        });
    }else{
        res.redirect(reactAddress + 'ownerLogin');
    }
};

module.exports = {
    deleteSection : deleteSection
}