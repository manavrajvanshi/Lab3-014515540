import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';

import './login.css';
let redirect = null;
        
export default class BuyerLogin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '',
            auth:false
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
        //console.log(data); 
        if(  data.email === "" || data.password === ""){
            // console.log(data.email);
            // console.log(data.password);
            console.log("Invalid data, Cannot Login");
        }else{
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/buyer/signin',data)
                .then(response => {
                    if(response.status === 200){
                        console.log("cookie: ",cookie.load('buyerData'));
                        if( cookie.load('authCookie') === "authenticated"){
                            this.setState({
                                auth:true
                            })
                        }
                    }else if(response.status === 201){
                        console.log(response.status+" error "+ response.data);
                        alert("Incorrect Password");
                    }else if(response.status === 202){
                        console.log(response.status+" error "+ response.data);
                        alert("No User with the given credentials.");
                    }
                }).catch(error=>{
                    console.log(error);
                });
        }
        
    }
    render(){
        if (cookie.load('authCookie')==="authenticated"){
            redirect = <Redirect to = "/buyerHome"/>
        }
        return(
            <div>
                {redirect}
                
                <form onSubmit = {this.login}className = "loginForm">
                    <table border = "0">
                        <tbody>
                            <tr>
                                <td>
                                    Email: 
                                </td>
                                <td>
                                    <input type = "email" name = "email" onChange = {this.handleInput} value = {this.state.email} required/>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Password: 
                                </td>
                                <td>
                                    <input type = "password" name = "password" onChange = {this.handleInput} required/>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan = "2" align = "center">
                                    <input type = "submit" name = "signin" value = "SIGN IN"/>
                                </td> 
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        )
    }
}
