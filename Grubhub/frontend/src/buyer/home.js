import React from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';
import ShowRestaurants from '../restaurant/showRestaurants.js'
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
        if(cookie.load('authCookieb') === "authenticated" ){  
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            let data = {
                "bid" : cookie.load('buyerData').bid
            }
            
            axios.post(nodeAddress+'buyer/home',data)
                .then(response => {
                    buyer = response.data;
                    image = nodeAddress+'buyer/'+data.bid+'.jpg';
                    this.setState({
                        imageRendered : true
                    })
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
                }
            );
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
            axios.post(nodeAddress+'buyer/searchItem',data)
        .then(response => {
            if(response.status === 200){
                //console.log(response.data);
                tableCreatedFlag = true;
                restaurantsTable = <ShowRestaurants  searchItem = { this.state.searchItem} cuisineFilter = {this.state.cuisineFilter}restaurantsList = {response.data}></ShowRestaurants>
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
                        <p>M: {buyer.phone}</p>
                
                        <input className = "inp" size = "45" type = "text" name ="searchItem" value = {this.state.searchItem} placeholder = "Hungry? Order Now" onChange = {this.handleInput}/>
                        <input pattern = "[A-Za-z]*" className = "inp" size = "45" type = "text" name = "cuisineFilter" value = {this.state.cuisineFilter} placeholder = "Filter by cuisine" onChange = {this.handleInput} />
                        <button className = "bttn" onClick = {this.search}><span role="img" aria-label="search">&#128269;</span></button>
                        {restaurantsTable}
                

                </div>
                
            </div>
        );
    }
}

export default BuyerHome;