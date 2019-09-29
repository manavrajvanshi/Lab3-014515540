import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
let re = null;

export default class OwnerUpdate extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            ownerName : '',
            ownerEmail : '',
            ownerPassword : '',
            ownerPhone : '',
            cuisine : '',
            restaurantName : '',
            restaurantZip : ''
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
            re = <Redirect to = "/"/>
            console.log("Inside Else");
        }
        return(
            <div>
                {re}
                <form onSubmit = {this.update}>
                    <table border = "0">
                        <tbody>
                            <tr>
                                <td>
                                   Owner Name: 
                                </td>
                                <td>
                                    <input type = "text" name = "ownerName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.ownerName} autoFocus    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Owner Email: 
                                </td>
                                <td>
                                    <input type = "email" name = "ownerEmail" onChange = {this.handleInput} value = {this.state.ownerEmail} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Owner Password: 
                                </td>
                                <td>
                                    <input type = "password" name = "ownerPassword" onChange = {this.handleInput}  />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Owner Phone: 
                                </td>
                                <td>
                                    <input type = "number" name = "ownerPhone" onChange = {this.handleInput} value = {this.state.ownerPhone} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Restaurant Name: 
                                </td>
                                <td>
                                    <input type = "text" name = "restaurantName" onChange = {this.handleInput} value = {this.state.restaurantName} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Restaurant Zip: 
                                </td>
                                <td>
                                    <input type = "text" name = "restaurantZip" onChange = {this.handleInput} value = {this.state.restaurantZip} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Cuisine: 
                                </td>
                                <td>
                                    <input type = "text" name = "cuisine" onChange = {this.handleInput} value = {this.state.cuisine} />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan = "2" align = "center">
                                    <input type = "submit" name = "update" value = "UPDATE"/>
                                </td> 
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        )
    }
}
