import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import './navbar.css';


export class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(){
        let url;
        if(cookie.load('userType')==="buyer"){
            url ='http://localhost:3001/buyer/logout';
        }else{
            url ='http://localhost:3001/restaurant/logout';
        }
        cookie.remove('authCookie');
        cookie.remove('userType');
        cookie.remove('userId');
        cookie.remove('buyerData');
        cookie.remove('ownerData');
        axios.get(url,{})
                .then(response => {
                    console.log("Logged Out");
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
                });
    }
    render(){
        let bar;
        let authCookie = cookie.load('authCookie');
        let userType = cookie.load('userType');
        //let userId = cookie.load('userId');
        

        if(authCookie === "authenticated"){
            
            
            if (userType === "buyer"){
                bar =  (
                    <div className = "topnav">
                        <a href="/buyerHome">{cookie.load('buyerData').name.split(" ")[0]}'s Profile</a>
                        <a href="/buyerUpdate">Update Profile</a>
                        <a href ="/buyerPicture">Upload Picture</a>
                        <a href="#/" >Hungry? Order Now</a>  
                        <a href="#/" >Past Orders</a> 
                        <a href="#/" >Order Status</a>   
                        <a href="#/" >Contact Us</a> 
                        <a href="/" onClick = {this.handleLogout}>Logout</a>        
                    </div>
                )
            }else if(userType === "owner"){
                bar =  (
                    <div className = "topnav">
                        <a href="/ownerHome">{cookie.load('ownerData').ownerName.split(" ")[0]}'s Profile</a>
                        <a href="/ownerUpdate">Update Profile</a>
                        <a href ="#/">Order Status</a>
                        <a href="/" onClick = {this.handleLogout}>Logout</a>        
                    </div>
                )
            }
        }else{
            bar = (
                <div className = "topnav">
                    <a href="/buyerLogin">Buyer Login</a>  
                    <a href="/ownerLogin">Owner Login</a>  
                    <a href="/buyerSignup">Buyer Signup</a>  
                    <a href="/ownerSignup">Owner Signup</a> 
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

