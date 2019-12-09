import React from 'react';
import {Redirect} from 'react-router';
import axios from 'axios';

import '../App.css';

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;
let re = null;
let buyer,image ;
let restaurantsTable=null;
let tableCreatedFlag = false;

class BuyerHome extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchItem :'',
            cuisineFilter :''
        }
        this.search = this.search.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount(){
        if(localStorage.getItem("authb")==1 ){  
            console.log("Authhhh");
            buyer = {
                name : localStorage.getItem('firstName')+" "+localStorage.getItem('lastName'),
                email : localStorage.getItem('email')
            }
            this.setState({});
        }else{
            re = <Redirect to = "/welcome"/>
            console.log("Inside Else");
        }
    }

    search(){
        let data = {
            'searchItem' : this.state.searchItem
        }
        if(this.state.searchItem !== ''){
            let token = localStorage.getItem("Buyer-Auth-Token");
            axios.post(nodeAddress+'buyer/searchItem',data, {
                headers: {
                    'Authorization' : token,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if(response.status === 200){
                    //console.log(response.data);
                    tableCreatedFlag = true;
                   
                }else{
                    alert(response.data);
                }
            this.setState({});
            })
            .catch(error => {
                alert("Error: "+JSON.stringify(error));
            });
        }else{
            alert("Enter a Dish Name to continue");
        }
        
    }
    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    
    
    render(){
        
        
        
        if(!buyer){
            return <div></div>;
        }
        if(tableCreatedFlag){
            tableCreatedFlag = false;
        }else{
            restaurantsTable = null;
        }
        return(
            <div className = "searchBoxBack">

        
                <div className = "homeContainer" style = {{paddingBottom:"40px"}}>
                    {re}
                    
                        <img src = {image} width ="200" height = "200" alt = 'Profile' className = "profilePic"/>
                        <p>Welcome {buyer.name}</p>
                        <p>Email: {buyer.email}</p>
                        
                
                        <input className = "inp" size = "45" type = "text" name ="searchItem" value = {this.state.searchItem} placeholder = "Hungry? Order Now!" onChange = {this.handleInput}/>
                        <input pattern = "[A-Za-z]*" className = "inp" size = "45" type = "text" name = "cuisineFilter" value = {this.state.cuisineFilter} placeholder = "Filter by cuisine" onChange = {this.handleInput} />
                        <button className = "bttn" onClick = {this.search}><span role="img" aria-label="search">&#128269;</span></button>
                        {restaurantsTable}
                

                </div>
                
            </div>
        );
    }
}

export default BuyerHome;