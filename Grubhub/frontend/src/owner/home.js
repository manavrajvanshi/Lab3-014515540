import React from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
let re = null;
export class OwnerHome extends React.Component{
    render(){
        let owner={
            
        };
        

        if(cookie.load('authCookie') === "authenticated" ){
            
            owner = cookie.load('ownerData')
        }else{
            re = <Redirect to = "/"/>
            
        }
       
        return(
            <div>
                {re}
                Welcome {JSON.stringify(owner)}
            </div>
        );
    }
}