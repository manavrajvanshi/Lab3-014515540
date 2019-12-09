import React from 'react';
import {Redirect} from 'react-router';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import './login.css';

const ownerLoginQuery = gql`
mutation signInOwner($email: String!, $password: String!){
    signInOwner(email: $email, password: $password) {
        id
        firstName
        lastName
        email
        restaurant
        cuisine
    }
}`;

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

class OwnerLogin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : ''
        }
        this.handleInput = this.handleInput.bind(this);
        this.login = this.login.bind(this);
    }
    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    async login(e){
        e.preventDefault();
        const vars = {
            email : this.state.email,
            password : this.state.password,
        }
        let {data} = await this.props.ownerLoginQuery({
            variables:vars
        });

        if(data.signInOwner != null){
            localStorage.setItem("firstName", data.signInOwner['firstName']);
            localStorage.setItem("lastName", data.signInOwner['lastName']);
            localStorage.setItem("email", data.signInOwner['email']);
            localStorage.setItem("id", data.signInOwner['id']);
            localStorage.setItem("restaurant", data.signInOwner['restaurant']);
            localStorage.setItem("cuisine", data.signInOwner['cuisine']);
            localStorage.setItem("autho", 1);
            localStorage.setItem("userType", "owner");
            this.setState({});
        }else{
            alert("Credentials Mismatch!");
        }
    }
    
    render(){

        let redirect = null;
        if (localStorage.getItem("autho")==1){
            redirect = <Redirect to = "/ownerHome"/>
        }
        return(
            <div className = "loginContainer" >
                
                {redirect}
                <h2 className = "hdng">Sign in with your Grubhub owner account</h2>
                <form onSubmit = {this.login} className = "loginForm">
                    <table border = "0" style={{margin:'auto'}}>
                        <tbody>
                            <tr>
                                <div>
                                    <label className = "hdng">
                                        Email
                                    </label>
            
                                    <td>
                                        <input className ="inp" type = "email" name = "email" onChange = {this.handleInput} value = {this.state.email} size = "45" required/>
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
                                    <input className = "bttn" type = "submit" name = "signin" value = "SIGN IN"/>
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
    graphql(ownerLoginQuery, {name :"ownerLoginQuery"})
)(OwnerLogin);