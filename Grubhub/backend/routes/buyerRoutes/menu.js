const database = require('../../database/database');
const Restaurant = database.Restaurant;

const menu = (req,res) => {
    if(req.cookies.authCookieb === 'authenticated'){
        let rid = req.body.rid;
        Restaurant.find( {_id:rid}, function(err,result){
            if(err){
                console.log(err);
                console.log("Error in first if, Check Backend -> buyer -> menu");
                res.writeHead(404);
                res.end("OOPS!! The restaurant is closed.");
            }else{
                if(result.length > 0 ){
                    let items = result[0].items;
                    let data = [];
                    for( let item of items){
                        data.push({
                            iid: item['_id'],
                            name: item['name'],
                            description: item['description'],
                            section: item['section'],
                            price: item['price']
                        })
                    }
                    res.writeHead(200);
                    res.end(JSON.stringify(data));
                }else{
                    console.log("No Items found at this restaurant.");
                    res.writeHead(404);
                    res.end("OOPS!! The restaurant is closed or out of items.");
                }
            }
        });
    }else{
        console.log("Error in second if. Check Backend -> buyer -> menu ");
        res.writeHead(405);
        
    }
};

module.exports = {
    menu : menu
}