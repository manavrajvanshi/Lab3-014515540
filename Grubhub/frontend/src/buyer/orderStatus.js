import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import '../App.css';

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

let flag = false;
let orderTable=[];
export default class OrderStatus extends React.Component{
    constructor(props){
        super(props);
        this.showChat = this.showChat.bind(this);
        this.sendChat = this.sendChat.bind(this);
        this.state = {
            orders :{},
            chatMessage : "",
        }
    }

    showChat(e){
        var rows = document.getElementsByName(e.target.value);

        for( let row of rows){
            //console.log(row);
            if (row.style.display === "none") {
            row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }

    sendChat(e){
        var chatMessage = document.getElementById(e.target.value).value;
        axios.defaults.withCredentials = true;
        let token = localStorage.getItem("Buyer-Auth-Token");
        let data = {
            "oid" : e.target.value,
            "chatMessage" : chatMessage,
        };
        axios.post(nodeAddress+'buyer/sendChat',data, {
            headers: {
                'Authorization' : token,
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(JSON.stringify(response.data));
            if(response.status === 200){
                window.location.reload();
            }else{
                console.log(response.data);
            }
        })
        .catch(error=>{
            console.log("Error: "+JSON.stringify(error));
            
        }
        );
    }

    componentDidMount(){
        
        axios.defaults.withCredentials = true;
        let token = localStorage.getItem("Buyer-Auth-Token");
        let data = {
            bid : cookie.load('buyerData').bid
        }
        axios.post(nodeAddress+'buyer/getCurrentOrders',data, {
            headers: {
                'Authorization' : token,
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.status === 200){
                flag = true;
                this.setState({
                    orders:response.data
                }, ()=>{
                    let orders = this.state.orders;
                    console.log(orders);
                    for(let order of orders){
                        let {oid,itemList,restaurantName,status,total} = order;
                        orderTable.push(
                            <tr>
                                <th>Order ID {oid}</th>
                                <th>Restaurant Name {restaurantName}</th>
                                <th>Total: ${total } </th>
                                <th>Status: {status}</th>
                                <th rowSpan = "2"><button style = {{"color": "red"}} value = {oid} onClick = {this.showChat}>CHAT</button></th>
                            </tr>
                        )

                        orderTable.push(
                            <tr>
                                <th colSpan = "2">Item</th>
                                <th colSpan = "2">Quantity</th>
                            </tr>
                        )

                        for(let item of itemList){
                            console.log(item);
                            orderTable.push(
                                <tr>
                                    <td colSpan = "2">{item.itemName}</td>
                                    <td colSpan = "2">{item.qty}</td>
                                </tr>
                            )
                        }

                        orderTable.push(
                            <tr style = {{display:"none"}} name = {oid}>
                                <td className = "hdng" colSpan = "4"><input class = "inp" type = "text" placeholder = "Enter Message" id = {oid} name ="chatMessage" /></td>
                                <td className = "hdng"><button onClick = {this.sendChat} value = {oid}>Send</button></td>
                            </tr>
                            
                        )
                        
                        //console.log(typeof order.message);
                        for(let message of order.message){
                            let sender = message.type;
                            let msg = message.message;

                            if(sender === "buyer"){
                                sender = "You"
                            }else{
                                sender = "Restaurant"
                            }
                            orderTable.push(
                                <tr style = {{display:"none"}} name = {oid}>
                                    <td><strong>{sender}</strong></td>
                                    <td colSpan="4">{msg}</td>
                                </tr>
                                
                            )
                        }
                    }
                    this.setState({})
                })
            }else{
                console.log(response.data);
            }
            
        }).catch(error=>{
            console.log("Error: "+JSON.stringify(error.data));
        }
        );
    }

    render(){
        let ree = null;
        if(cookie.load('authCookieb')!=='authenticated'){
            ree = <Redirect to = "/welcome"/>
        }
        if(!flag){
            return(
                <div>
                    Loading your current orders....
                </div>
            )
        }
        return(
            <div className = "orderContainer">
                {ree}
                <table className = "order">
                    <thead>
                        <tr>
                            <td class = "hdng" colspan = "5">Your Upcoming Orders</td>
                        </tr>
                    </thead>
                    <tbody>
                        {orderTable}
                    </tbody>
                </table>
            </div>
        )
    }
}
