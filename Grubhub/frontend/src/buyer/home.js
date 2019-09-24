import React from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
let re = null;
export class BuyerHome extends React.Component{
    render(){
        let buyer={
            
        };
        

        if(cookie.load('authCookie') === "authenticated" ){
            buyer = cookie.load('buyerData')
        }else{
            re = <Redirect to = "/"/>
            console.log("Inside Else");
        }
       
        return(
            <div>
                {re}
                Welcome {JSON.stringify(buyer)}
            </div>
        );
    }
}