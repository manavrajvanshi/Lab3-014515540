import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';
import '../App.css';
let re = null;
let flag = false;

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

let orderTable=[];
export default class ManageOrder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            orders :{},
            message:''
        }

        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.createTable = this.createTable.bind(this);
        this.showChat = this.showChat.bind(this);
        this.sendChat = this.sendChat.bind(this);
    }

    showChat(e){
        var rows = document.getElementsByName(e.target.value);

        for( let row of rows){
            //console.log(row);
            if(row.tagName === "SELECT"){}
            else if (row.style.display === "none") {
            row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }

    sendChat(e){
        var chatMessage = document.getElementById(e.target.value).value;
        axios.defaults.withCredentials = true;
        let token = localStorage.getItem("Owner-Auth-Token");
        let data = {
            "oid" : e.target.value,
            "chatMessage" : chatMessage,
        };

        console.log(data);
        axios.post(nodeAddress+'restaurant/sendChat',data, {
            headers: {
                'Authorization' : token,
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(JSON.stringify(response.data));
            if(response.status === 200){
                //window.location.reload();
                orderTable = [];
                this.createTable();

            }else{
                console.log(response.data);
            }
        })
        .catch(error=>{
            console.log("Error: "+JSON.stringify(error));
            
        }
        );
    }
    createTable(){
        axios.defaults.withCredentials = true;
        let token = localStorage.getItem("Owner-Auth-Token");
        let data = {
            rid : cookie.load('ownerData').rid
        }
        axios.post(nodeAddress+'restaurant/viewOrders',data,{
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
                        
                    for(let order of orders){
                        let {oid,itemList,buyerName,status,total,address} = order;
                        orderTable.push(
                            <tr>
                                
                                <th>Buyer Name: {buyerName}</th>
                                <th>Total: ${total } </th>
                                <th>Status: {status}</th>
                                <th>Delivery Address</th>
                                <th rowSpan = "2"><button style = {{"color": "red"}} value = {oid} onClick = {this.showChat}>CHAT</button></th>
                            </tr>
                        )

                        orderTable.push(
                            <tr>
                                <th>Item</th>

                                <th>Quantity</th>
                                <th>
                                    <select className = "inp" name = {oid} onChange = {this.handleStatusChange}>
                                        <option defaultValue value ={status}>Set Status</option>
                                        <option value="New">New</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Ready">Ready</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </th>
                                <th>{address}</th>
                            </tr>
                        )

                        for(let item of itemList){
                            //console.log(item);
                            orderTable.push(
                                <tr>
                                    <td >{item.itemName}</td>
                                    <td >{item.qty}</td>
                                    
                                </tr>
                            )
                        }
                        orderTable.push(
                            <tr style = {{display:"none"}} name = {oid}>
                                <td className = "hdng" colSpan = "4"><input class = "inp" type = "text" placeholder = "Enter Message" id = {oid} name ="chatMessage" /></td>
                                <td className = "hdng"><button onClick = {this.sendChat} value = {oid}>Send</button></td>
                            </tr>
                            
                        )
                        for(let message of order.message){
                            let sender = message.type;
                            let msg = message.message;

                            if(sender == "restaurant"){
                                sender = "You"
                            }else{
                                sender = "Buyer"
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
                this.setState({message: "No orders to display"})
            }
            
        }).catch(error=>{
            console.log("Error: "+JSON.stringify(error.data));
            
        });
    }

    handleStatusChange(e){
        let oid = e.target.name;
        let status = e.target.value;

        let data = {
            'oid':oid,
            'status':status
        }

        axios.defaults.withCredentials = true;
        let token = localStorage.getItem("Owner-Auth-Token");
        axios.post(nodeAddress+'restaurant/updateStatus',data,{
            headers: {
                'Authorization' : token,
                'Accept' : 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(response.status === 200){
                console.log(response.data);
                orderTable = [];
                this.createTable();
                
            }else{
                console.log("Status Not Updated");
                console.log(response.data);
            }
            
        }).catch(error=>{
            console.log("Error: "+JSON.stringify(error.data));
        }
        );
    }
    
    componentDidMount(){
        this.createTable();
    }
    render(){

        if(cookie.load('authCookieo') !== "authenticated" ){
            re = <Redirect to = "/welcome"/>
        }
        if(!flag){
            return(
                <div>
                    {this.state.message}
                </div>
            )
        }
        return(
            <div className = "menuContainer">
                {re}
                <table className = "menu">
                    
                    <tbody>
                        {orderTable}
                    </tbody>
                </table>
            </div>
        )
    }
}