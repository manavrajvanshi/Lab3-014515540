import React from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import axios from 'axios';
let re = null;
let owner;
class OwnerHome extends React.Component{
    UNSAFE_componentWillMount(){
        if(cookie.load('authCookie') === "authenticated" ){
            
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            let data = {
                "rid" : cookie.load('ownerData').rid
            }
            
            axios.post('http://localhost:3001/restaurant/home',data)
                .then(response => {
                    owner = response.data;
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
        
        

        if(!owner){
            return <div></div>
        }
        return(
            <div>
                {re}
                {console.log(owner)}
                <div>
                    <p>Welcome {owner.ownerName}</p>
                    <p>Your E-mail: {owner.ownerEmail}</p>
                    <p>Your Contact Number: {owner.ownerPhone}</p>
                </div>
                
                
            </div>
        );
    }
}

export default OwnerHome;