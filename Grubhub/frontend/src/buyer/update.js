import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';

export class BuyerUpdate extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            name :cookie.load('buyerData').name,
            email :cookie.load('buyerData').email,
            password:cookie.load('buyerData').password,
            phone:cookie.load('buyerData').phone
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
            console.log(JSON.stringify(this.state));
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/buyer/update',data)
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
                                    Name: 
                                </td>
                                <td>
                                    <input type = "text" name = "name" onChange = {this.handleInput} value = {this.state.name} autoFocus required/>
                                </td>
                            </tr>

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
                                    <input type = "password" name = "password" onChange = {this.handleInput} required />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Phone: 
                                </td>
                                <td>
                                    <input type = "number" name = "phone" onChange = {this.handleInput} value = {this.state.phone} />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan = "2" align = "center">
                                    <input type = "submit" name = "signupdateup" value = "UPDATE"/>
                                </td> 
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        )
    }
}