import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import '../App.css';

// const buyerSignupMutation = gql`
// {

// }
// `
var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;
let re = null;
class BuyerSignup extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            firstName :'',
            lastName:'',
            email:'',
            password:'',
            phone:'',
            signedup:false
        }
        this.signup = this.signup.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    signup(e){
        e.preventDefault();
        const data = {
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            email : this.state.email,
            password : this.state.password,
        }

        if( data.firstName === "" || data.lastName ==="" || data.email === "" || data.password === ""){
            console.log("Invalid data, Cannot signup");
        }else{
            
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post(nodeAddress+'buyer/signup',data)
                .then(response => {
                    if(response.status === 200){
                        alert("Sucessfully Signed Up, please update your profile after logging in.");
                        re = <Redirect to = '/buyerLogin'/>
                        this.setState({
                            signedup :true
                        })
                        
                    }else if(response.status === 201){
                        alert("Error Signing up.");
                        console.log(response.data);
                    }else if(response.status === 202){
                        alert(response.data);
                    }
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error.data));
                }
            );
        }
        
    }
    render(){
        
        return(
            <div className = "signupContainer" >
                {re}
                <h2 className = "hdng">Create your account</h2>
                <form onSubmit = {this.signup}>
                    <table border = "0" style={{margin:'auto'}}>
                        <tbody>
                            <tr>
                                <div>
                                    <label className = "hdng">
                                        First Name
                                    </label>
                                    
                                    <td>
                                        <input className = "inp"type = "text" name = "firstName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.firstName} size = "45" autoFocus required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Last Name
                                    </label>
                                    
                                    <td>
                                        <input className = "inp"type = "text" name = "lastName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.lastName} size = "45" required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Email
                                    </label>
                                    
                                    <td>
                                    <input className = "inp" type = "email" name = "email" onChange = {this.handleInput} value = {this.state.email} size = "45" required/>
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
                                    <input className = "bttn" type = "submit" name = "signup" value = "SIGN UP"/>
                                </td> 
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        )
    }
}

export default BuyerSignup;
//export default graphql(buyerSignupMutation)(BuyerSignup);