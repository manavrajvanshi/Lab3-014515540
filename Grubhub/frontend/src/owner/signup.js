import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import '../App.css';
let re = null;
export default class OwnerSignup extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            name : '',
            email : '',
            password : '',
            restaurantName :'',
            restaurantZip : ''
        }
        this.handleInput = this.handleInput.bind(this);
        this.signup = this.signup.bind(this);
    }

    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    signup(e){
        e.preventDefault();

        const data = {
            name : this.state.name,
            email : this.state.email,
            password : this.state.password,
            restaurantName : this.state.restaurantName,
            restaurantZip : this.state.restaurantZip
        }
        console.log(data);
        if( data.name === "" || data.email === "" || data.password === ""){
            console.log("Invalid data, Cannot signup");
        }else{
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/restaurant/signup',data)
                .then(response => {
                    if(response.status === 200){
                        alert("Sucessfully Signed Up, please update your profile after logging in.");
                        re = <Redirect to = '/ownerLogin'/>
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
                                        Name
                                    </label>
                                    
                                    <td>
                                        <input className = "inp" size = "45" type = "text" name = "name" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.name} autoFocus required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <lable className = "hdng">
                                        Email
                                    </lable>
                                    <td>
                                        <input className ="inp" size = "45" type = "email" name = "email" onChange = {this.handleInput} value = {this.state.email} required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Password
                                    </label>
                                    <td>
                                        <input className ="inp" size = "45" type = "password" name = "password" onChange = {this.handleInput} required />
                                    </td>
                                </div>
                            </tr>
                            
                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Restaurant Name
                                    </label>
                                    <td>
                                    <input className ="inp" size = "45" type = "text" name = "restaurantName" onChange = {this.handleInput}  value = {this.state.restaurantName} required />
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Restaurant Zip
                                    </label>
                                    <td>
                                        <input className = "inp" size = "45" type = "number" name = "restaurantZip" onChange = {this.handleInput}  value = {this.state.restaurantZip}required />
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



