import React from 'react';
import cookie from 'react-cookies';



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
                        <a href="#home">Welcome {userId}</a>
                        <a href="#updateProfile">Update Profile</a>
                        <a href="#logButton">Logout</a>        
                    </div>
                )
            }
        }else{
            bar = (
                <div>
                    <a href="/buyerLogin">Buyer Login</a>  
                    <a href="/ownerLogin">Owner Login</a>  
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