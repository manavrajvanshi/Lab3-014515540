const database = require('../../database/database');
const Restaurant = database.Restaurant;

const menu = (req,res) => {
    if(req.cookies.authCookieo === 'authenticated'){
        let ownerData = req.cookies.ownerData;
        let rid = JSON.parse(ownerData).rid;
        Restaurant.findById(rid, function(err, result){
            if(err){
                console.log(err);
                console.log("Error in first if. Check Backend -> restaurant -> menu ")
            }else{
                if(result){
                    let items = result.items;
                    //console.log(result);
                    res.end(JSON.stringify(items));
                }else{
                    console.log("No items stored");
                    console.log(result);
                    res.end();
                }
            }
        });
    }else{
        console.log("Not Authenticated (Backend / Restaurant / menu)");
        res.writeHead(405);
    }
};

module.exports = {
    menu : menu
}