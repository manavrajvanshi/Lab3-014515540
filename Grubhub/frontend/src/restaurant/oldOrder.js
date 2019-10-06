import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';
import '../App.css';
let re = null;
let flag = false;
let orderTable=[];
export default class OldOrder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            orders :{},
            message:''
        }
        this.createTable = this.createTable.bind(this);

    }


    createTable(){
        axios.defaults.withCredentials = true;
        let data = {
            rid : cookie.load('ownerData').rid
        }
        axios.post('http://localhost:3001/restaurant/oldOrder',data)
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
                                    <th colSpan = "2">Quantity</th>
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
            <div class = "menuContainer">
                {re}
                <table className = "order">
                    
                    <tbody>
                        {orderTable}
                    </tbody>
                </table>
            </div>
        )
    }
}