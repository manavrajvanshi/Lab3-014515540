var connection =  new require('./kafka/Connection');
//topics files
var BuyerSignup = require('./services/BuyerSignup.js');
var BuyerSignin = require('./services/BuyerSignin.js');
var BuyerUpdate = require('./services/BuyerUpdate.js');
var BuyerHome = require('./services/BuyerHome.js');
var BuyerGetCurrentOrders = require('./services/BuyerGetCurrentOrders.js');
var BuyerGetPastOrders = require('./services/BuyerGetPastOrders.js');
var BuyerMenu = require('./services/BuyerMenu.js');
var BuyerPlaceOrder = require('./services/BuyerPlaceOrder.js');
var BuyerSearchItem = require('./services/BuyerSearchItem.js');
var BuyerSendChat = require('./services/BuyerSendChat.js');

var RestaurantSignup = require('./services/RestaurantSignup.js');
var RestaurantSignin = require('./services/RestaurantSignin.js');
var RestaurantUpdate = require('./services/RestaurantUpdate.js');
var RestaurantHome = require('./services/RestaurantHome.js');
var RestaurantMenu = require('./services/RestaurantMenu.js');
var RestaurantAddItem = require('./services/RestaurantAddItem.js');
var RestaurantDeleteMenuItem = require('./services/RestaurantDeleteMenuItem.js');
var RestaurantDeleteSection = require('./services/RestaurantDeleteSection.js');
var RestaurantOldOrders = require('./services/RestaurantOldOrders.js');
var RestaurantSendChat = require('./services/RestaurantSendChat.js');
var RestaurantUpdateItem = require('./services/RestaurantUpdateItem.js');
var RestaurantUpdateSection = require('./services/RestaurantUpdateSection.js');
var RestaurantUpdateStatus = require('./services/RestaurantUpdateStatus.js');
var RestaurantViewOrders = require('./services/RestaurantViewOrders.js');
var database = require('./database/database.js');

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { 
                    topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
// first argument is topic name
// second argument is a function that will handle this topic request
handleTopicRequest("buyer_signup", BuyerSignup);
handleTopicRequest("buyer_signin", BuyerSignin);
handleTopicRequest("buyer_update", BuyerUpdate);
handleTopicRequest("buyer_home",BuyerHome);
handleTopicRequest("buyer_getCurrentOrders",BuyerGetCurrentOrders);
handleTopicRequest("buyer_getPastOrders",BuyerGetPastOrders);
handleTopicRequest("buyer_menu",BuyerMenu);
handleTopicRequest("buyer_placeOrder",BuyerPlaceOrder);
handleTopicRequest("buyer_searchItem",BuyerSearchItem);
handleTopicRequest("buyer_sendChat",BuyerSendChat);

handleTopicRequest("restaurant_signup", RestaurantSignup);
handleTopicRequest("restaurant_signin",RestaurantSignin);
handleTopicRequest("restaurant_update", RestaurantUpdate);
handleTopicRequest("restaurant_home",RestaurantHome);
handleTopicRequest("restaurant_menu",RestaurantMenu);
handleTopicRequest("restaurant_addItem",RestaurantAddItem);
handleTopicRequest("restaurant_deleteMenuItem",RestaurantDeleteMenuItem);
handleTopicRequest("restaurant_deleteSection",RestaurantDeleteSection);
handleTopicRequest("restaurant_oldOrders",RestaurantOldOrders);
handleTopicRequest("restaurant_sendChat",RestaurantSendChat);
handleTopicRequest("restaurant_updateItem",RestaurantUpdateItem);
handleTopicRequest("restaurant_updateSection",RestaurantUpdateSection);
handleTopicRequest("restaurant_updateStatus",RestaurantUpdateStatus);
handleTopicRequest("restaurant_viewOrders", RestaurantViewOrders);

//handleTopicRequest("buyer_signin",BuyerSignin);
