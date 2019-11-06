import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import '../App.css';

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

let re = null;
export default class BuyerUpdate extends React.Component{

    constructor(props){
        super(props);   
        this.state = {
            name : cookie.load('buyerData').name,
            email : cookie.load('buyerData').email,
            password :'',
            phone :cookie.load('buyerData').phone
        }  
        
        this.handleInput = this.handleInput.bind(this);
        this.update = this.update.bind(this);
    }

    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    update(e){
        e.preventDefault();
        const data = {
            name : this.state.name,
            email : this.state.email,
            password : this.state.password,
            phone : this.state.phone,
            bid : cookie.load('buyerData').bid
        }

        if( data.name === "" || data.email === "" || data.password === ""){
            console.log("Invalid data, Cannot Update");
        }else{
            
            axios.defaults.withCredentials = true;
            let token = localStorage.getItem("Buyer-Auth-Token");
            axios.post(nodeAddress+'buyer/update',data, {
                headers: {
                    'Authorization' : token,
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if(response.status === 200){
                    for(let cookieItem in response.data){
                        console.log(cookieItem);
                        console.log(response.data[cookieItem])
                        cookie.save(cookieItem,response.data[cookieItem],{encode:String} )
                        
                    }
                    alert("Profile Updated");
                    re = <Redirect to = "/buyerHome"/>
                    this.setState({
                        updated: true
                    })
                }else if( response.status === 201){
                    alert("Some Error Occured, records not updated");
                    console.log(response.data);
                }else if(response.status === 202){
                    alert("The email belongs to someone else");
                }
                
            }).catch(error=>{
                console.log("Error: "+JSON.stringify(error.data));
            });
        }
        
    }
    render(){
        if(cookie.load('authCookieb') !== "authenticated" ){
            re = <Redirect to = "/welcome"/>
            console.log("Inside Else");
        }
        return(
            <div className = "updateContainer">
                {re}
                <h2 className = "hdng">Update your profile</h2>
                <form onSubmit = {this.update}>
                    <table border = "0" style={{margin:'auto'}}>
                        <tbody>
                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Name
                                    </label>
                                    <td>
                                        <input className = "inp" size = "45" type = "text" name = "name" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.name}  autoFocus required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Email
                                    </label>
                                    <td>
                                        <input className = "inp" size = "45" type = "email" name = "email" onChange = {this.handleInput} value = {this.state.email}  required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Password
                                    </label>
                                    <td>
                                        <input className = "inp" size = "45" type = "password" name = "password" onChange = {this.handleInput} required />
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Phone
                                    </label>
                                    <td>
                                        <input className = "inp" size = "45" type = "text" name = "phone" pattern="[0-9]{10}" title="10 Digits Only" onChange = {this.handleInput} value = {this.state.phone} />
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <td colSpan = "2" align = "center">
                                    <input className = "bttn" type = "submit" name = "update" value = "UPDATE"/>
                                </td> 
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        )
    }
}
