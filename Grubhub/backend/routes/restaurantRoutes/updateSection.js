const database = require('../../database/database');
const Restaurant = database.Restaurant;

const updateSection = (req,res) => {
    if(req.cookies.authCookieo === 'authenticated'){
        let rid = req.body.rid;
        let oldSection = req.body.oldSection;
        let newSectionName = req.body.newSectionName;
        Restaurant.findById(rid, function(err, restaurant){
            if(err){
              console.log(err);
              console.log("Error in first if. Check Backend -> restaurant -> updateSection");
              res.writeHead(400);
              res.end("Section Not Updated");
            }else{
                //console.log(restaurant);
                let items = restaurant.items;
                for(let item of items){     
                    if( item.section == oldSection  ){
                        item.section = newSectionName;
                    }
                }
                restaurant.save(function(err,result){
                    if(err){
                        console.log(err);
                        console.log("Error in Second if. Check Backend -> restaurant -> updateSection");
                        res.writeHead(400);
                        res.end("Section Not Updated");
                    }else{
                        //console.log(result);
                        res.writeHead(200);
                        res.end("Section Updated");
                        console.log("Section Updated"); 
                    }
                })
            }
        });
    }
};

module.exports = {
    updateSection: updateSection
}