import React from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';

let re = null;
let buyer ;
class BuyerHome extends React.Component{
    UNSAFE_componentWillMount(){
        if(cookie.load('authCookie') === "authenticated" ){  
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            let data = {
                "bid" : cookie.load('buyerData').bid
            }
            
            axios.post('http://localhost:3001/buyer/home',data)
                .then(response => {
                    buyer = response.data;
                    this.forceUpdate();
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
                }
            );
        }else{
            re = <Redirect to = "/"/>
            console.log("Inside Else");
        }
    }
    
    render(){
        if(!buyer){
            return <div></div>
        }
        return(
            <div>
                {re}
                
                <div>
                    <p>Welcome {buyer.name}</p>
                    <p>Your E-mail: {buyer.email}</p>
                    <p>Your Contact Number: {buyer.phone}</p>
                </div>
                
                
            </div>
        );
    }
}

export default BuyerHome;