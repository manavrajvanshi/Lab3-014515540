const database = require('../../database/database');
const Restaurant = database.Restaurant;

const updateItem = (req,res) =>{
    let name = req.body.nameUpdate;
    let description = req.body.descriptionUpdate;
    let price = req.body.priceUpdate;
    let section = req.body.sectionUpdate;
    let iid = req.body.iid;
    let rid = req.body.rid;

    Restaurant.findById(rid, function(err, restaurant){
        if(err){
          console.log(err);
          console.log("Error in first if. Check Backend -> restaurant -> updateItem");
          res.writeHead(400);
          res.end("Item Not Updated");
        }else{
            //console.log(restaurant);
            let items = restaurant.items;
            for(let item of items){     
                if( item._id == iid  ){
                    item.name = name;
                    item.description = description;
                    item.section = section;
                    item.price = price;
                    break;
                }
            }
            restaurant.save(function(err,result){
                if(err){
                    console.log(err);
                    console.log("Error in Second if. Check Backend -> restaurant -> updateItem");
                    res.writeHead(400);
                    res.end("Item Not Updated");
                }else{
                    //console.log(result);
                    res.writeHead(200);
                    res.end("Item Updated");
                    console.log("Item Updated"); 
                }
            })
        }
    });
}

module.exports = {
    updateItem:updateItem
}