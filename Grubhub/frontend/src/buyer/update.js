import React from 'react';
import {Redirect} from 'react-router';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import '../App.css';

const buyerUpdateMutation = gql`
mutation updateBuyer($id:ID!, $firstName:String!, $lastName:String!, $email:String!, $password:String!){
    updateBuyer(
        id :$id,
        firstName: $firstName, 
        lastName: $lastName, 
        email:$email,
        password: $password
    ){
        id
        firstName
        lastName
        email
    }
}`;

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

let re = null;
class BuyerUpdate extends React.Component{

    constructor(props){
        super(props);   
        this.state = {
            firstName : localStorage.getItem('firstName'),
            lastName : localStorage.getItem('lastName'),
            email : localStorage.getItem('email'),
            password :''
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
            lastName: this.state.lastName,
            email : this.state.email,
            password : this.state.password,
            id : localStorage.getItem('id')
        }
        console.log(vars);

        let {data} =  await this.props.buyerUpdateMutation({
            variables:vars
        });

        console.log(data);
        if(data.updateBuyer != null){
            localStorage.setItem("firstName", data.updateBuyer['firstName']);
            localStorage.setItem("lastName", data.updateBuyer['lastName']);
            localStorage.setItem("email", data.updateBuyer['email']);
            localStorage.setItem("id", data.updateBuyer['id']);
            localStorage.setItem("authb", 1);
            localStorage.setItem("userType", "buyer");
            re = <Redirect to = "/buyerHome"/>
            this.setState({});
        }else{
            alert("Details Not Updated!");
        }
    }
    render(){
        if (localStorage.getItem("authb")!=1){
            re = <Redirect to = "/welcome"/>
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
                                        First Name
                                    </label>
                                    <td>
                                        <input className = "inp" size = "45" type = "text" name = "firstName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.firstName}  autoFocus required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Last Name
                                    </label>
                                    <td>
                                        <input className = "inp" size = "45" type = "text" name = "lastName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.handleInput} value = {this.state.lastName} required/>
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

export default compose(
    graphql(buyerUpdateMutation, {name :"buyerUpdateMutation"})
)(BuyerUpdate);