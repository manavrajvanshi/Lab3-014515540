import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';


export class BuyerLogin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email :"",
            password:"",
            auth :false
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
            axios.post('http://localhost:3001/buyer/signin',data)
                .then(response => {
                    console.log(cookie.load('buyerData'));
                    if( cookie.load('authCookie') === "authenticated"){
                        this.setState({
                            auth:true
                        })
                    }
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
                });
        }
        
    }
    render(){
        let redirect = null;
        if (this.state.auth || cookie.load('authCookie')==="authenticated"){
            redirect = <Redirect to = "/buyerHome"/>
        }
        return(
            <div>
                {redirect}
                
                <form onSubmit = {this.login}>
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