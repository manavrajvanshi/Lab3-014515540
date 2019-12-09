import React from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';
import './home.css';

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

let re = null;
let owner, image;
export default class OwnerHome extends React.Component{

    componentDidMount(){
        if(localStorage.getItem("autho")==1 ){  
            console.log("Authhhh");
            owner = {
                name : localStorage.getItem('firstName')+" "+localStorage.getItem('lastName'),
                email : localStorage.getItem('email'),
                restaurant: localStorage.getItem('restaurant'),
                cuisine: localStorage.getItem('cuisine'),
            }
            this.setState({});
        }else{
            re = <Redirect to = "/welcome"/>
            console.log("Inside Else");
        }
    }
    
    render(){
        if(!owner){
            return <div></div>
        }
        return(
            <div className = "searchBoxBack" >
                <div className = "homeContainer">
                    {re}
                    <div className = "heading">
                        <img src = {image} width ="200" height = "200" alt = 'Please Upload A Profile Pic'className = "profilePic"/>
                        {console.log(owner)}
                        <p>Welcome {owner.name}</p>
                        <p>Your E-mail: {owner.email}</p>
                        <p>Your Restaurant: {owner.restaurant}</p>
                        <p>Cuisine: {owner.cuisine}</p>
                    </div>
                </div>
            </div>
        );
    }
}

