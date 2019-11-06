import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import './login.css';

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

export default class OwnerLogin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : ''
        }
        this.handleInput = this.handleInput.bind(this);
        this.login = this.login.bind(this);
    }
    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    login(e){
        e.preventDefault();
        const data = {
            email : this.state.email,
            password : this.state.password,
        }

        if(  data.email === "" || data.password === ""){
            console.log("Invalid data, Cannot Login");
        }else{
            
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post(nodeAddress+'restaurant/signin',data)
            .then(response => {
                if(typeof (Storage) !== "undefined"){
                    localStorage.setItem("Owner-Auth-Token", response.headers.authorization);
                }else{
                    alert("Please use a browser that uses local storage!");
                }
                if(response.status === 200){
                    for(let cookieItem in response.data){
                        console.log(cookieItem);
                        console.log(response.data[cookieItem])
                        cookie.save(cookieItem,response.data[cookieItem],{encode:String} )
                        //Cookies.set(cookieItem,JSON.stringify(response.data[cookieItem]));
                    }
                    console.log(cookie.load('ownerData'));
                    if( cookie.load('authCookieo') === "authenticated"){
                        this.setState({
                            auth : true
                        })
                    }
                }else if(response.status === 201){
                    console.log(response.status+" error "+ response.data);
                    alert("Incorrect Password");
                }else if(response.status === 202){
                    console.log(response.status+" error "+ response.data);
                    alert("No User with the given credentials.");
                }else if(response.status === 203){
                    console.log("Error in first if in backend - restaurant - signin")
                }          
            }).catch(error=>{
                console.log("Error: "+JSON.stringify(error));
            });
        }   
    }
    
    render(){

        let redirect = null;
        if (cookie.load('authCookieo')==="authenticated"){
            redirect = <Redirect to = "/ownerHome"/>
        }
        return(
            <div className = "loginContainer" >
                
                {redirect}
                <h2 className = "hdng">Sign in with your Grubhub owner account</h2>
                <form onSubmit = {this.login} className = "loginForm">
                    <table border = "0" style={{margin:'auto'}}>
                        <tbody>
                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Email
                                    </label>
            
                                    <td>
                                        <input className ="inp" type = "email" name = "email" onChange = {this.handleInput} value = {this.state.email} size = "45" required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label  className = "hdng">
                                        Password 
                                    </label>
                                    <td>
                                        <input className ="inp" type = "password" name = "password" onChange = {this.handleInput} size = "45" required/>
                                    </td>
                                </div>
                                
                            </tr>

                            <tr>
                                <td colSpan = "2" align = "center">
                                    <input className = "bttn" type = "submit" name = "signin" value = "SIGN IN"/>
                                </td> 
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        )
    }
}

