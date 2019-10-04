import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';

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
                                    <th>Item</th>
                                    <th>Quantity</th>
                                </tr>
                            )

                            for(let item of itemList){
                                //console.log(item);
                                orderTable.push(
                                    <tr>
                                        <td>{item.itemName}</td>
                                        <td>{item.qty}</td>
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

        if(cookie.load('authCookie') !== "authenticated" ){
            re = <Redirect to = "/"/>
        }
        if(!flag){
            return(
                <div>
                    {this.state.message}
                </div>
            )
        }
        return(
            <div>
                {re}
                <table>
                    
                    <tbody>
                        {orderTable}
                    </tbody>
                </table>
            </div>
        )
    }
}