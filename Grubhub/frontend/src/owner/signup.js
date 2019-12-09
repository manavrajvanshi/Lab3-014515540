import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import '../App.css';

const ownerSignupMutation = gql`
mutation($firstName:String!, $lastName:String!, $email: String!, $password: String!,$restaurantName:String!, $restaurantCuisine:String!) {
    signUpOwner(firstName: $firstName, lastName: $lastName, email: $email, password: $password, restaurant: $restaurantName , cuisine: $restaurantCuisine) {
        firstName
        lastName
        email
        restaurant
        cuisine
        password
    }
}`;

let re = null;
var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

class OwnerSignup extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            firstName : '',
            lastName: '',
            email : '',
            password : '',
            restaurantName :'',
            restaurantCuisine : ''
        }
        this.handleInput = this.handleInput.bind(this);
        this.signup = this.signup.bind(this);
    }

    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    async signup(e){
        e.preventDefault();

        const vars = {
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            email : this.state.email,
            password : this.state.password,
            restaurantName : this.state.restaurantName,
            restaurantCuisine : this.state.restaurantCuisine
        }
        console.log(vars);
        let {data} = await this.props.ownerSignupMutation({
            variables: vars
        });

        if(data.signUpOwner == null){
            alert("Email already exists!");
        }else{
            re = <Redirect to = '/ownerLogin'/>
            this.setState({});
        }
        console.log(data);
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
                                        <input className = "inp" size = "45" type = "text" name = "firstName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.firstName} autoFocus required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Last Name
                                    </label>
                                    
                                    <td>
                                        <input className = "inp" size = "45" type = "text" name = "lastName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.lastName}  required/>
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
                                        Restaurant Cuisine
                                    </label>
                                    <td>
                                        <input className = "inp" size = "45" type = "text" name = "restaurantCuisine" onChange = {this.handleInput}  value = {this.state.restaurantCuisine}required />
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
export default compose(
    graphql(ownerSignupMutation, {name :"ownerSignupMutation"})
)(OwnerSignup);