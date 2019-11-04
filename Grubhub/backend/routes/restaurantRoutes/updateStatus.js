const database = require('../../database/database');
const Order = database.Order;

const updateStatus = (req,res) =>{
    if(req.cookies.authCookieo === 'authenticated'){
        Order.findById( req.body.oid, function(err, order){
            if(err){
                console.log(err);
                console.log("Error in Second if. Check Backend -> restaurant -> updateStatus ");
                res.writeHead(400);
                res.end("Status Not Updated");
            }else{
                order.status = req.body.status;
                order.save( function (err, result){
                    if(err){
                        console.log("Error in Third if. Check Backend -> restaurant -> updateStatus ");
                        res.writeHead(400);
                        res.end("Status Not Updated");
                    }else{
                        res.writeHead(200);
                        res.end('Status Updated');       
                    }
                } );
            }
        });
    }else{
        console.log("Error in first if/else. Check Backend -> restaurant -> updateStatus ");
        res.writeHead(400);
        res.end("Status Not Updated / Not Authorized");
    }
};

module.exports = {
    updateStatus : updateStatus
}