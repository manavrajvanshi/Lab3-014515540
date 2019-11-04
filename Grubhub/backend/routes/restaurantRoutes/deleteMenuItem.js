const database = require('../../database/database');
const Restaurant = database.Restaurant;

const deleteMenuItem = (req,res) => {
    if( req.cookies.authCookieo === 'authenticated'){
        let iid = req.body.iid;
        let rid = req.body.rid;

        Restaurant.findById(rid, function(err, restaurant){
            if(err){
              console.log(err);
              console.log("Error in first if. Check Backend -> restaurant -> deleteMenuItem");
              res.writeHead(500);
              res.end();
            }else{
                //console.log(restaurant);
                let items = restaurant.items;
                for(let item of items){     
                    if( item._id == iid  ){
                    item.remove();
                    break;
                    }
                }
                restaurant.save(function(err,result){
                    if(err){
                        console.log(err);
                        console.log("Error in Second if. Check Backend -> restaurant -> deleteMenuItem");
                        res.writeHead(500);
                        res.end();
                    }else{
                        //console.log(result);
                        res.writeHead(200);
                        res.end();
                        console.log("Item Deleted"); 
                    }
                })
            }
        });
    }
}

module.exports = {
    deleteMenuItem : deleteMenuItem
}