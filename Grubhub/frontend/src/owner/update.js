import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import '../App.js'
let re = null;

export default class OwnerUpdate extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            ownerName : cookie.load('ownerData').ownerName,
            ownerEmail : cookie.load('ownerData').ownerEmail,
            ownerPassword : '',
            ownerPhone : cookie.load('ownerData').ownerPhone,
            cuisine : cookie.load('ownerData').cuisine,
            restaurantName : cookie.load('ownerData').restaurantName,
            restaurantZip : cookie.load('ownerData').restaurantZip
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
            ownerName : this.state.ownerName,
            ownerEmail : this.state.ownerEmail,
            ownerPassword : this.state.ownerPassword,
            ownerPhone : this.state.ownerPhone,
            rid : cookie.load('ownerData').rid,
            cuisine : this.state.cuisine,
            restaurantName : this.state.restaurantName,
            restaurantZip : this.state.restaurantZip
        }
        console.log(data);
        if( data.ownerName === "" || data.ownerEmail === "" || data.ownerPassword === ""){
            console.log("Invalid data, Cannot Update");
        }else{
            // console.log("HEREEEE")
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/restaurant/update',data)
                .then(response => {
                    console.log(response.data);
                    this.forceUpdate();
                    if(response.status === 200){
                        alert("Profile Updated");
                        re = <Redirect to = '/ownerHome'/>
                        this.setState({
                            updated : true
                        })
                    }else if( response.status === 201){
                        alert("Data not updated, contact support team.");
                        console.log(response.data);
                    }else if(response.status === 202){
                        console.log("Data not updated, contact support team.");
                    }
                    else if(response.status === 203){
                        alert(response.data);
                    }
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
                }
            );
        }
        
    }
    
    render(){
        if(cookie.load('authCookie') !== "authenticated" ){
            re = <Redirect to = "/welcome"/>
            console.log("Inside Else");
        }
        return(
            <div className = "updateContainer">
                {re}
                <form onSubmit = {this.update} >
                    <table border = "0" style={{margin:'auto'}}>
                        <tbody>
                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Owner Name
                                    </label>
                                    <td>
                                        <input className = "inp"size = "45" type = "text" name = "ownerName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.ownerName} autoFocus    />
                                    </td>
                                </div>
                            </tr>
                            
                            
                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Owner Email
                                    </label>
                                    <tr>
                                        <input className = "inp" size = "45" type = "email" name = "ownerEmail" onChange = {this.handleInput} value = {this.state.ownerEmail} />
                                    </tr>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Password
                                    </label>
                                    <tr>
                                        <input className = "inp" size = "45" type = "password" name = "ownerPassword" onChange = {this.handleInput}  />
                                    </tr>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Owner Phone
                                    </label>
                                    <tr>
                                        <input className = "inp" size = "45" type = "number" name = "ownerPhone" onChange = {this.handleInput} value = {this.state.ownerPhone} />
                                    </tr>
                                </div>
                            </tr>
                                
                            <tr>
                                <div>
                                    <label className = "hdng">
                                    Restaurant Name
                                    </label>
                                    <tr>
                                        <input className = "inp" size = "45" type = "text" name = "restaurantName" onChange = {this.handleInput} value = {this.state.restaurantName} />  
                                    </tr>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Restaurant Zip
                                    </label>
                                    <tr>
                                        <input className = "inp"size = "45" type = "text" name = "restaurantZip" onChange = {this.handleInput} value = {this.state.restaurantZip} />   
                                    </tr>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className= "hdng">
                                        Cuisine
                                    </label>
                                    <tr>
                                        <input className = "inp" size = "45" type = "text" name = "cuisine" onChange = {this.handleInput} value = {this.state.cuisine} />
                                    </tr>
                                </div>
                            </tr>

                            <tr>
                                <td colSpan = "2" align = "center">
                                    <input className = "bttn"type = "submit" name = "update" value = "UPDATE"/>
                                </td> 
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        )
    }
}
