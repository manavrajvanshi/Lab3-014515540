import React from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';
import './home.css';
import ShowRestaurants from '../restaurant/showRestaurants.js'

let re = null;
let buyer,image ;
let restaurantsTable=null;
let tableCreatedFlag = false;

class BuyerHome extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchItem :''
        }
        this.search = this.search.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount(){
        if(cookie.load('authCookie') === "authenticated" ){  
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            let data = {
                "bid" : cookie.load('buyerData').bid
            }
            
            axios.post('http://localhost:3001/buyer/home',data)
                .then(response => {
                    buyer = response.data;
                    image = "http://localhost:3001/buyer/"+data.bid+".jpg";
                    this.setState({
                        imageRendered : true
                    })
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
                }
            );
        }else{
            re = <Redirect to = "/"/>
            console.log("Inside Else");
        }
    }

    search(){

        let data = {
            'searchItem' : this.state.searchItem
        }
        axios.post('http://localhost:3001/buyer/searchItem',data)
        .then(response => {
            if(response.status === 200){
                console.log(response.data);
                tableCreatedFlag = true;
                restaurantsTable = <ShowRestaurants key = "random" searchItem = { this.state.searchItem} restaurantsList = {response.data}></ShowRestaurants>
            }else{
                alert("OOPS! Something went wrong, Try again after some time.");
            }
            this.setState({});

        })
        .catch(error => {
            alert("Error: "+JSON.stringify(error));
        });
    }
    handleInput(e){
        this.setState({
            searchItem : e.target.value
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
            
            <div>
                {re}
                <div name = "profile">
                    <img src = {image} width ="200" height = "200" alt = 'Profile'/>
                    <p>Welcome {buyer.name}</p>
                    <p>Your E-mail: {buyer.email}</p>
                    <p>Your Contact Number: {buyer.phone}</p>
                </div>

                <div name = "search">
                    <input type = "text" name ="searchItem" value = {this.state.searchItem} placeholder = "Hungry? Order Now" onChange = {this.handleInput}/>
                    <button onClick = {this.search}><span role="img" aria-label="search">&#128269;</span></button>
                </div>

               {restaurantsTable}
                
            </div>
        );
    }
}

export default BuyerHome;