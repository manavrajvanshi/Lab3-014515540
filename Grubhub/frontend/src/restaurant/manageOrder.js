import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';
import '../App.css';
let re = null;
let flag = false;
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

    }


    createTable(){
        axios.defaults.withCredentials = true;
        let data = {
            rid : cookie.load('ownerData').rid
        }
        axios.post('http://localhost:3001/restaurant/viewOrders',data)
            .then(response => {
                if(response.status === 200){
                    flag = true;
                    this.setState({
                        orders:response.data
                    }, ()=>{
                        let orders = this.state.orders;
                         
                        for(let order of orders){
                            let {oid,itemList,buyerName,status,total} = order;
                            orderTable.push(
                                <tr>
                                    <th>Order ID {oid}</th>
                                    <th>Buyer Name: {buyerName}</th>
                                    <th>Total: ${total } </th>
                                    <th>Status: {status}</th>
                                    
                                </tr>
                            )

                            orderTable.push(
                                <tr>
                                    <th colSpan = "2">Item</th>
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
                                </tr>
                            )

                            for(let item of itemList){
                                //console.log(item);
                                orderTable.push(
                                    <tr>
                                        <td colSpan = "2">{item.itemName}</td>
                                        <td colSpan = "2">{item.qty}</td>
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
                
            }
        );
    }

    handleStatusChange(e){
        let oid = e.target.name;
        let status = e.target.value;

        let data = {
            'oid':oid,
            'status':status
        }

        axios.defaults.withCredentials = true;
            
            axios.post('http://localhost:3001/restaurant/updateStatus',data)
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

        if(cookie.load('authCookie') !== "authenticated" ){
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