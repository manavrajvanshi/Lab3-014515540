import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import '../App.js'

import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';

let re = null;
var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

const ownerUpdateMutation = gql`
mutation updateOwner($id:ID!, $firstName:String!, $lastName:String!, $email:String!, $password:String!, $restaurant:String!, $cuisine:String!){
   
    updateOwner(
        id :$id,
        firstName: $firstName, 
        lastName:$lastName,
        email:$email,
        password:$password,
        restaurant:$restaurant,
        cuisine:$cuisine
    ){
        id
        firstName, 
        lastName,
        email,
        restaurant,
        cuisine
    }
}`;

class OwnerUpdate extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            firstName : localStorage.getItem('firstName'),
            lastName : localStorage.getItem('lastName'),
            ownerPassword : '',
            email : localStorage.getItem('email'),
            cuisine : localStorage.getItem('cuisine'),
            restaurant : localStorage.getItem('restaurant')
            
        }
        this.handleInput = this.handleInput.bind(this);
        this.update = this.update.bind(this);
    }

    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    async update(e){
        e.preventDefault();
        const vars = {
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            password : this.state.ownerPassword,
            email : this.state.email,
            id :localStorage.getItem('id'),
            cuisine : this.state.cuisine,
            restaurant : this.state.restaurant
            
        }
        console.log(vars);
        let {data} =  await this.props.ownerUpdateMutation({
            variables:vars
        });

       console.log(data);
        if(data.updateOwner != null){
            localStorage.setItem("firstName", data.updateOwner['firstName']);
            localStorage.setItem("lastName", data.updateOwner['lastName']);
            localStorage.setItem("email", data.updateOwner['email']);
            localStorage.setItem("id", data.updateOwner['id']);
            localStorage.setItem("restaurant", data.updateOwner['restaurant']);
            localStorage.setItem("cuisine", data.updateOwner['cuisine']);
            localStorage.setItem("autho", 1);
            localStorage.setItem("userType", "owner");
            re = <Redirect to = "/ownerHome"/>
            this.setState({});
        }else{
            alert("Details Not Updated!");
        }
    }
    
    render(){
        if (localStorage.getItem("autho")!=1){
            re = <Redirect to = "/welcome"/>
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
                                        First Name
                                    </label>
                                    <td>
                                        <input className = "inp"size = "45" type = "text" name = "firstName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.firstName} autoFocus required  />
                                    </td>
                                </div>
                            </tr>
                            
                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Last Name
                                    </label>
                                    <tr>
                                        <input className = "inp"size = "45" type = "text" name = "lastName" onChange = {this.handleInput} value = {this.state.lastName} />   
                                    </tr>
                                </div>
                            </tr>
                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Email
                                    </label>
                                    <tr>
                                        <input className = "inp" size = "45" type = "email" name = "email" onChange = {this.handleInput} value = {this.state.email} />
                                    </tr>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Password
                                    </label>
                                    <tr>
                                        <input className = "inp" size = "45" type = "password" name = "ownerPassword" onChange = {this.handleInput}  value = {this.state.ownerPassword} />
                                    </tr>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                    Restaurant Name
                                    </label>
                                    <tr>
                                        <input className = "inp" size = "45" type = "text" name = "restaurantName" onChange = {this.handleInput} value = {this.state.restaurant} />  
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

export default compose(
    graphql(ownerUpdateMutation, {name :"ownerUpdateMutation"})
)(OwnerUpdate);