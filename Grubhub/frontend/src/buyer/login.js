import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import {gql} from 'apollo-boost';
import {graphql} from 'react-apollo';
import {flowRight as compose} from 'lodash';
import '../App.css';

const buyerLoginQuery = gql`
mutation signInBuyer($email: String!, $password: String!) 
{
    signInBuyer(email: $email, password: $password) {
        id
        firstName
        lastName
        email
    }
}
`;

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

let redirect = null;
        
class BuyerLogin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '',
            auth:false
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
        // const data = {
        //     email : this.state.email,
        //     password : this.state.password,
        // }

        console.log(this.state);

        let {data} = await this.props.buyerLoginQuery({
            variables:{
                email: this.state.email,
                password : this.state.password
            }
        });

        console.log(data);
        if(data.signInBuyer != null){
            localStorage.setItem("firstName", data.signInBuyer['firstName']);
            localStorage.setItem("lastName", data.signInBuyer['lastName']);
            localStorage.setItem("email", data.signInBuyer['email']);
            localStorage.setItem("id", data.signInBuyer['id']);
            localStorage.setItem("authb", 1);
            this.setState({});
        }else{
            alert("Credentials Mismatch!");
        }

        
        
        
    }
    render(){
        console.log(this.props.data);
        if (localStorage.getItem("authb")==1){
            redirect = <Redirect to = "/buyerHome"/>
        }
        return(
            <div className = "loginContainer" >
                {redirect}
                <h2 className = "hdng">Sign in with your Grubhub buyer account</h2>
                
                <form onSubmit = {this.login} className = "loginForm" >
                    <table border = "0" style={{margin:'auto'}}>
                        <tbody>
                            <tr>

                                <div>
                                    <label className = "heading">
                                        Email
                                    </label>
            
                                    <td>
                                        <input className ="inp" type = "email" name = "email" onChange = {this.handleInput} value = {this.state.email} size = "45" required/>
                                    </td>
                                </div>
                            </tr>

                            <tr>
                                <div>
                                    <label  className = "heading">
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
    graphql(buyerLoginQuery, {name :"buyerLoginQuery"})
)( BuyerLogin);