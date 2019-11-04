const database = require('../../database/database');
const Restaurant = database.Restaurant;

const searchItem = (req,res) =>{
    let searchItem = req.body.searchItem;
    console.log(searchItem);

    Restaurant.find( {}, function(err,restaurants){
        if(err){
            console.log(err);
            console.log("Error in first if. Check Backend -> Buyer -> searchItem ");
            res.writeHead(202);
            res.end("Sorry, We're closed!");
        }else{
            let restaurantResult = [];
            for(let restaurant of restaurants){
                let items = restaurant.items;
                for( let item of items){
                    if(item.name == searchItem){
                        restaurantResult.push(
                            {
                                rid : restaurant._id,
                                restaurantName : restaurant.restaurantName,
                                cuisine : restaurant.cuisine
                            }
                        );
                    }
                }
            }
            if(restaurantResult.length == 0 ){
                res.writeHead(202);
                console.log("Item not available at any of the restaurants!");
                res.end("Item not found at any of the restaurants!");
            }else{
                res.writeHead(200);
                res.end(JSON.stringify(restaurantResult));
                console.log(restaurantResult);
            }
        }
    });
};

module.exports = {
    searchItem : searchItem
}