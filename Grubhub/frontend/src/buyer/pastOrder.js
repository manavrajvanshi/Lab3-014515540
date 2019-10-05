import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';


let flag = false;
let orderTable=[];
export default class PastOrder extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            orders :{}
        }
    }
    componentDidMount(){
        
        axios.defaults.withCredentials = true;
        let data = {
            bid : cookie.load('buyerData').bid
        }
        axios.post('http://localhost:3001/buyer/getPastOrders',data)
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
                                    <th>{restaurantName}</th>
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
                                console.log(item);
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
                }
                
            }).catch(error=>{
                console.log("Error: "+JSON.stringify(error.data));
            }
        );
    }

    render(){

        if(!flag){
            return(
                <div>
                    Loading your Past orders....
                </div>
            )
        }
        return(
            <div className = "orderContainer">
                <table className = "order">
                    <thead>
                        <tr>
                            <td class = "heading" colspan = "4">Your Past Orders</td>
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
