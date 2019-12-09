import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import '../App.css';

const buyerLoginQuery = gql`
{
    buyer{
      firstName
    }
  }
`;

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

let redirect = null;
        
class BuyerLogin extends React.Component{

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
            axios.post(nodeAddress+'buyer/signin',data)
            .then(response => {
                if(response.status === 200){
                    for(let cookieItem in response.data){
                        console.log(cookieItem);
                        console.log(response.data[cookieItem])
                        cookie.save(cookieItem,response.data[cookieItem],{encode:String} )
                        //Cookies.set(cookieItem,JSON.stringify(response.data[cookieItem]));
                    }
                    //console.log("cookie: ",cookie.load('buyerData'));
                    console.log("Cookie Data ", response.data);

                    if(typeof (Storage) !== "undefined"){
                        localStorage.setItem("Buyer-Auth-Token", response.headers.authorization);
                    }else{
                        alert("Please use a browser that uses local storage!");
                    }
                    if( cookie.load('authCookieb') === "authenticated"){
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
                console.log("ADD: "+ nodeAddress+'buyer/signin');
                console.log(error);
            });
        }
        
    }
    render(){
        console.log(this.props);
        if (cookie.load('authCookieb')==="authenticated"){
            redirect = <Redirect to = "/buyerHome"/>
        }
        return(
            <div className = "loginContainer" >
                {redirect}
                <h2 className = "hdng">Sign in with your Grubhub buyer account</h2>
                
                <form onSubmit = {this.login} className = "loginForm" >
                    <table border = "0" style={{margin:'auto'}}>
                        <tbody>
                            <tr>

                                <div>
                                    <label className = "heading">
                                        Email
                                    </label>
            
                                    <td>
                                        <input className ="inp" type = "email" name = "email" onChange = {this.handleInput} value = {this.state.email} size = "45" required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label  className = "heading">
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

export default graphql(buyerLoginQuery)( BuyerLogin);