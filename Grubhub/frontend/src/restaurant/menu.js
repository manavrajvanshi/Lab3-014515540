import React from 'react';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import axios from 'axios';

let re = null;
export default class Menu extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            auth: false,
            name:'',
            description : '',
            price: '',
            section : ''
        }
        this.data = '';
        this.handleInput = this.handleInput.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.addItem = this.addItem.bind(this);
    }
    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleDelete(e){
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/restaurant/deleteMenuItem',{iid:e.target.value})
        .then(response => {
            if(response.status === 200 ){
                console.log("Item Deleted");
                window.location.reload();
            }
        })
        .catch(error => console.log("Error"));
    }

    addItem (e){
        e.preventDefault();

        let itemData = {
            name: this.state.item,
            description : this.state.description,
            price: this.state.price,
            section : this.state.section,
            rid : cookie.load('ownerData').rid
        }

        axios.defaults.withCredentials = true;

        if( itemData.name !== '' && itemData.description !== '' && itemData.price !== '' && itemData.section !== ''){
            axios.post('http://localhost:3001/restaurant/addItem',itemData)
            .then(response => {
                if(response.status === 200 ){
                    window.location.reload();
                }else{
                    console.log("Item Not Added");
                }
            }).catch(error => console.log(error));
        }
        
        
    }
    componentDidMount(){
        
        console.log(cookie.load('authCookie'));

        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/restaurant/menu',{})
        .then(response => {
            this.data = response.data;
            
            console.log(this.data);
            this.setState({
                auth:true
            })
        }).catch(error => console.log(error));
    }

    createTable(){
        let itemsArray = [];
        
        itemsArray.push(
            
        <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Section</th>
            <th>Price</th>
            <th>Add / Delete</th>
        </tr>
        );
        itemsArray.push(
            
            <tr>            
                <td><input type = "text" name = "item" onChange = {this.handleInput} value = {this.state.item}/></td>
                <td><input type = "text" name = "description" onChange = {this.handleInput} value = {this.state.description}/></td>
                <td><input type = "text" name = "section" onChange = {this.handleInput} value = {this.state.section}/></td>
                <td><input type = "text" name = "price" onChange = {this.handleInput} value = {this.state.price}/></td>
                <td><input type = "Submit" value = "Add"/></td>
            </tr>
       
        );
        if(this.data.length > 0){
            for( let item in this.data){
                //console.log(this.data);
                itemsArray.push(
                <tr>
                    <td>{this.data[item].name}</td>
                    <td>{this.data[item].description}</td>
                    <td>{this.data[item].section}</td>
                    <td>{this.data[item].price}</td>
                    <td><button value = {this.data[item].iid} onClick = {this.handleDelete}>Delete</button></td>
                </tr>
                
                );
            }
        }
        
        return itemsArray;
    }
    
    render(){
        
        if(cookie.load('authCookie') !== 'authenticated'){
            re = <Redirect to = '/ownerLogin'/>
        }else{
            
        }
        return (
            <div>
                {re}
                <form onSubmit = {this.addItem}>
                    <table>
                        <tbody>
                        {this.createTable()}
                        </tbody>
                        
                    </table>
                </form>
            </div>
        )
    }
}