import React from 'react';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import axios from 'axios';

export default class Order extends React.Component{
//cookie.load('buyerData').bid
    constructor(props){
        super(props);

        this.data = [];
        this.state = {
            quantity : {},
            prices :{},
            totalStatement : 'Your Total : $0',
            total: 0
        }

        this.handleQuantity = this.handleQuantity.bind(this);
        this.calculateTotal = this.calculateTotal.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
    }

    handleQuantity(e){
        
        this.setState({
            quantity : Object.assign({},this.state.quantity,{[e.target.name]:e.target.value})
        }, () => {
            this.calculateTotal();
        });

    }

    calculateTotal(){
        let quan = this.state.quantity;
        let prices = this.state.prices;

        // console.log(this.state.prices);
        // console.log(this.state.quantity);
        let orderTotal = 0;
        for (let item in quan){
            orderTotal += quan[item] * prices[item];
        }

        //console.log(this.state.total);

        this.setState({
            totalStatement : `Your Total: $${orderTotal}`,
            total : orderTotal
        })
    }
    
    placeOrder(){
        axios.defaults.withCredentials = true;
        let data = {
            rid: this.props.location.state.rid,
            bid : cookie.load('buyerData').bid,
            total : this.state.total,
            quantity : this.state.quantity

        }

        //console.log(data);
        
        axios.post('http://localhost:3001/buyer/placeOrder',data)
        .then(response => {
            console.log(response.data);
        }).catch(error => console.log(error));
    }
    
    componentDidMount(){

        if(cookie.load('authCookie')!=='authenticated'){
            let re = <Redirect to ="/buyerLogin"></Redirect>
            return re
        }
        let rid = this.props.location.state.rid;
        axios.defaults.withCredentials = true;
        let data = {
            rid: rid
        }
        //console.log(data);
        axios.post('http://localhost:3001/buyer/menu',data)
        .then(response => {
            this.data = response.data;
            let pricesList = {}
            this.data.forEach( element =>{
                pricesList = Object.assign( {}, pricesList, {[element.name]:element.price})
            })
            console.log(this.data);
            this.setState({
                prices: pricesList
            })
            
        }).catch(error => console.log(error));
    }

    createTable(){
        let itemsArray = [];    
        let sections = new Set();
        for( let item in this.data){
            sections.add(this.data[item].section)
        }
        itemsArray.push(
        <tr key ="..">
            <th>Item</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
        </tr>
        );
        if(this.data.length > 0){
            sections.forEach(
                section =>{
                    itemsArray.push(
                        <tr key = {section}>
                            <th>
                                {section}
                            </th>
                        </tr>
                    )
                    this.data.forEach(
                        element =>{
                            if (element.section === section){
                                itemsArray.push(
                                    <tr key = {element.iid}>
                                        <td>{element.name}</td>
                                        <td>{element.description}</td>
                                        <td>{element.price}</td>
                                        <td><input type = "number" name = {element.name}
                                            value = {this.state.quantity[element.name]}
                                            onChange = {this.handleQuantity} /></td>
                                    </tr>
                                )
                            }
                        }
                    )
                }
            )            
        }
        return itemsArray;
    }
    render(){
        
        if(cookie.load('authCookie')!=='authenticated'){
            let re = <Redirect to ="/buyerLogin"></Redirect>
            return re
        }
        return(
            <div>
                <form >
                    <table>
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </form>
                <br>
                </br>
                <div>
                    {this.state.totalStatement}
                    { <button  onClick ={this.placeOrder} >Order</button>}
                    
                </div>
            </div>
        )
    }
}

