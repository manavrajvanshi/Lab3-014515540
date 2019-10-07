import React from 'react';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import axios from 'axios';
import '../App.css';

let ree;
export default class Order extends React.Component{
//cookie.load('buyerData').bid
    constructor(props){
        super(props);

        this.data = [];
        this.state = {
            quantity : {},
            prices :{},
            totalStatement : 'Your Total : $0',
            total: 0,
            deliveryAddress:''
        }

        this.handleQuantity = this.handleQuantity.bind(this);
        this.calculateTotal = this.calculateTotal.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        this.setState({
            deliveryAddress : e.target.value
        })
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
            quantity : this.state.quantity,
            address : this.state.deliveryAddress

        }

        for(let key in data.quantity){
            if(data.quantity[key] <= 0){
                delete data.quantity[key]
            }
        }

        console.log(data.quantity);
        if( Object.keys(data.quantity).length !== 0 && this.state.deliveryAddress !== ''){
            axios.post('http://3.17.10.253:3001/buyer/placeOrder',data)
            .then(response => {
            console.log(response.data);
            alert("Order Placed, You will be redirected to order Status Page. Click OK to continue");
            ree =  <Redirect to ="/buyerOrderStatus"/>;
            this.setState({});
            }).catch(error => console.log(error));
        }else if(this.state.deliveryAddress === ''){
            alert("Please Enter the delivery address.")
        }else{
            alert("Please Select Quantity > 1");
        }
        
    }
    
    componentDidMount(){

        if(cookie.load('authCookieb')!=='authenticated'){
            let re = <Redirect to ="/buyerLogin"></Redirect>
            return re
        }
        let rid = this.props.location.state.rid;
        axios.defaults.withCredentials = true;
        let data = {
            rid: rid
        }
        //console.log(data);
        axios.post('http://3.17.10.253:3001/buyer/menu',data)
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
        
        if(this.data.length > 0){
            sections.forEach(
                section =>{
                    itemsArray.push(
                        <tr key = {section}>
                            <th colSpan = "5">
                                {section}
                            </th>
                        </tr>
                    );
                    itemsArray.push(
                        <tr key ={1+section}>
                            <th>Item Image</th>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                        );
                    this.data.forEach(
                        element =>{
                            if (element.section === section){
                                itemsArray.push(
                                    <tr key = {element.iid}>
                                        <td><img className = "itemImage" src = {"http://3.17.10.253:3001/item/"+element.iid+".jpg"} width ="200" height = "200" alt = 'Picture Not Uploaded by Owner'/></td>
                                        <td>{element.name}</td>
                                        <td>{element.description}</td>
                                        <td>${element.price}</td>
                                        <td><input className = "inp" type = "number" min = "0" name = {element.name}
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
        
        if(cookie.load('authCookieb')!=='authenticated'){
            let re = <Redirect to ="/buyerLogin"></Redirect>
            return re
        }
        return(
            <div className = "searchBoxBack">
            <div className = "menuContainer">
                {ree}
                <form >
                    <table className = "menu">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </form>
                <br>
                </br>
                <div>
                    {this.state.totalStatement}
                    <br></br><br></br>
                    <input className = "inp" type = "text" name ="address" placeholder = "Enter the Delivery address (240 Chars)" value = {this.state.deliveryAddress} onChange = {this.handleChange}/>
                    {<button style = {{width:"40%"}}className = "bttn" onClick ={this.placeOrder} >Order</button>}
                    
                </div>
            </div>
            </div>
        )
    }
}

