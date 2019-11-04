const database = require('../../database/database');
const Restaurant = database.Restaurant;

const addItem = (req, res)=>{
    let name = req.body.name;
    let description = req.body.description;
    let price = req.body.price;
    let section = req.body.section;
    let rid = req.body.rid;
    //console.log(name, description, price, section, rid);
    if(req.cookies.authCookieo === 'authenticated'){
        Restaurant.findById(rid, function(err, result){
            if(err){
              console.log(err);
              console.log("Error in first if. Check Backend -> restaurant -> addItem ");
            }else{
              let restaurant = result;
              let item = {
                name: name,
                description : description,
                section : section,
                price: price,
                rid : rid
              };
              restaurant.items.push(item);
              restaurant.save( function(err,result){
                if(err){
                    res.writeHead(400);
                    res.end();
                    console.log(err);
                    console.log("Error in second if. Check Backend -> restaurant -> addItem ");
                }else{
                    //console.log(result);
                    res.writeHead(200);
                    res.end();
                    console.log("Item Added");
                }
              });
            }
          });
    }else{
        console.log("Not Authenticated (/addItem)");
        res.writeHead(400);
        res.end();
    }
}

module.exports = {
    addItem : addItem
}