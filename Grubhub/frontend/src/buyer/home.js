import React from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
let re = null;
export class BuyerHome extends React.Component{
    render(){
        let buyer={
            name :"",
            email :"",
            phone:""
        };
        

        if(cookie.load('authCookie') === "authenticated" ){
            buyer = cookie.load('buyerData')
        }else{
            re = <Redirect to = "/buyerLogin"/>
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