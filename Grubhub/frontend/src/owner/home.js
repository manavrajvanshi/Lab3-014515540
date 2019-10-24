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
        if(cookie.load('authCookieo') === "authenticated" ){
            
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            let data = {
                "rid" : cookie.load('ownerData').rid
            }
            
            axios.post(nodeAddress+'restaurant/home',data)
                .then(response => {
                    owner = response.data;
                    image = nodeAddress+'owner/'+data.rid+'.jpg';
                    this.setState({
                        imageRendered : true
                    })
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
                }
            );
        }else{
            re = <Redirect to = "welcome/"/>
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
                        <p>Welcome {owner.ownerName}</p>
                        <p>Your E-mail: {owner.ownerEmail}</p>
                        <p>Your Contact Number: {owner.ownerPhone}</p>
                    </div>
                    
                </div>
            </div>
        );
    }
}

