import React from 'react';
import cookie from 'react-cookies';
import axios from 'axios';



export class Navbar extends React.Component{
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(){
        cookie.remove('authCookie');
        cookie.remove('userType');
        cookie.remove('userId');
        cookie.remove('buyerData');
        cookie.remove('ownerData');
        axios.get('http://localhost:3001/restaurant/logout',{})
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
        let userId = cookie.load('userId');

        if(authCookie === "authenticated"){
            
            
            if (userType === "buyer"){
                bar =  (
                    <div >
                        <a href="/buyerHome">Welcome {userId}</a>
                        <a href="/buyerUpdate">Update Profile</a>
                        <a href="/" onClick = {this.handleLogout}>Logout</a>        
                    </div>
                )
            }else if(userType === "owner"){
                bar =  (
                    <div >
                        <a href="/ownerHome">Welcome {userId}</a>
                        <a href="/ownerUpdate">Update Profile</a>
                        <a href="/" onClick = {this.handleLogout}>Logout</a>        
                    </div>
                )
            }
        }else{
            bar = (
                <div>
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