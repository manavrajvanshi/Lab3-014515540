import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import './navbar.css';

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

export class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(){
       
        localStorage.clear();
       
    }
    render(){
        let bar;
        
        let userType = localStorage.getItem('userType');
        //let userId = cookie.load('userId');
        

        if(localStorage.getItem("authb")==1 || localStorage.getItem("autho")==1 ){
            
            
            if (userType === "buyer"){
                bar =  (
                    <div className = "topnav">
                        <a className="navbar-brand" href='http://localhost:3000/welcome'>
                        <img alt = "Grubhub Logo" width="130px" height="35px"src='https://www.grubhub.com/assets/img/grubhub/logo-full-primary.svg'/>
                        </a>
                        <a href="/buyerHome">{localStorage.getItem("firstName")}'s Profile</a>
                        <a href="/pastOrder" >Past Orders</a> 
                        <a href="/buyerOrderStatus" >Order Status</a>    
                        <a href="/welcome" style = {{float: "right"}} onClick = {this.handleLogout}>Logout</a> 
                        <a href ="/buyerPicture" style = {{float: "right"}}>Upload Picture</a>       
                        <a href="/buyerUpdate" style = {{float: "right"}}>Update Profile</a>
                    </div>
                )
            }else if(userType === "owner"){
                //console.log(cookie.load('ownerData').restaurantName);
                bar =  (
                    <div className = "topnav">
                        <a className="navbar-brand" href='http://localhost:3000/welcome'>
                        <img alt = "Grubhub Logo" width="130px" height="35px"src='https://www.grubhub.com/assets/img/grubhub/logo-full-primary.svg'/>
                        </a>
                        <a href="/ownerHome">{localStorage.getItem("firstName")}'s Profile</a>
                        <a href ="/menu">View/Edit Menu</a>
                        <a href="/manageOrder" >View / Manage Orders</a> 
                        <a href="/oldOrder" >Old Orders</a> 
                        <a href="/welcome" style = {{float: "right"}} onClick = {this.handleLogout}>Logout</a>  
                        <a href ="/ownerPicture" style = {{float: "right"}}>Upload Picture</a>      
                        <a href="/ownerUpdate" style = {{float: "right"}}>Update Profile</a>
                    </div>
                )
            }
        }else{
            bar = (
                <div className = "topnav">
                    <a className="navbar-brand" href='http://localhost:3000/welcome'>
                        <img alt ="Grubhub Logo" width="130px" height="35px"src='https://www.grubhub.com/assets/img/grubhub/logo-full-primary.svg'/>
                    </a>
                    <a href="/ownerSignup"style = {{float: "right"}}>Owner Signup</a> 
                    <a href="/ownerLogin" style = {{float: "right"}}>Owner Login</a>  
                    <a href="/buyerSignup"style = {{float: "right"}}>Buyer Signup</a>  
                    <a href="/buyerLogin" style = {{float: "right"}}>Buyer Login</a>  
                    
                </div>
            )
        }
        


        return(

            <div>
                
                {bar}
            </div>
        )
    }
}

