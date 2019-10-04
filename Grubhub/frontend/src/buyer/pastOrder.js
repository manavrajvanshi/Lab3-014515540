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
                                    <th>Item</th>
                                    <th>Quantity</th>
                                </tr>
                            )

                            for(let item of itemList){
                                console.log(item);
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
            <div>
                <table>
                    <thead>
                        <tr>
                            <td>Your Past Orders</td>
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
