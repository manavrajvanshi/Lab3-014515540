import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

export class OwnerUpdate extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            ownerName :cookie.load('ownerData').ownerName,
            ownerEmail :cookie.load('ownerData').ownerEmail,
            ownerPassword :cookie.load('ownerData').ownerPassword,
            ownerPhone :cookie.load('ownerData').ownerPhone,
            cuisine : cookie.load('ownerData').cuisine,
            restaurantName :cookie.load('ownerData').restaurantName,
            restaurantZip :cookie.load('ownerData').restaurantZip
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

        if( data.ownerName === "" || data.ownerEmail === "" || data.ownerPassword === ""){
            console.log("Invalid data, Cannot Update");
        }else{
            console.log(JSON.stringify(this.state));
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/restaurant/update',data)
                .then(response => {
                    console.log(response.data);
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error.data));
                }
            );
        }
        
    }
    render(){
        return(
            <div>
                <form onSubmit = {this.update}>
                    <table border = "0">
                        <tbody>
                            <tr>
                                <td>
                                   Owner Name: 
                                </td>
                                <td>
                                    <input type = "text" name = "ownerName" onChange = {this.handleInput} value = {this.state.ownerName} autoFocus required/>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Owner Email: 
                                </td>
                                <td>
                                    <input type = "email" name = "ownerEmail" onChange = {this.handleInput} value = {this.state.ownerEmail} required/>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Owner Password: 
                                </td>
                                <td>
                                    <input type = "password" name = "ownerPassword" onChange = {this.handleInput} required />
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