import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import {connect} from 'react-redux'; 
import './login.css';
let redirect = null;
        
class BuyerLogin extends React.Component{

    constructor(props){
        super(props);
        this.login = this.login.bind(this);
    }
    
    login(e){
        e.preventDefault();
        const data = {
            email : this.props.email,
            password : this.props.password,
        }
        //console.log(data); 
        if(  data.email === "" || data.password === ""){
            // console.log(data.email);
            // console.log(data.password);
            console.log("Invalid data, Cannot Login");
        }else{
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/buyer/signin',data)
                .then(response => {
                    if(response.status === 200){
                        console.log("cookie: ",cookie.load('buyerData'));
                        if( cookie.load('authCookie') === "authenticated"){
                            //this.forceUpdate();
                            this.props.authf();
                        }
                    }else if(response.status === 201){
                        console.log(response.status+" error "+ response.data);
                        alert("Incorrect Password");
                    }else if(response.status === 202){
                        console.log(response.status+" error "+ response.data);
                        alert("No User with the given credentials.");
                    }
                }).catch(error=>{
                    console.log(error);
                });
        }
        
    }
    render(){
        if (cookie.load('authCookie')==="authenticated"){
            redirect = <Redirect to = "/buyerHome"/>
        }
        return(
            <div>
                {redirect}
                
                <form onSubmit = {this.login}className = "loginForm">
                    <table border = "0">
                        <tbody>
                            <tr>
                                <td>
                                    Email: 
                                </td>
                                <td>
                                    <input type = "email" name = "email" onChange = {this.props.handleInput} value = {this.props.email} required/>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Password: 
                                </td>
                                <td>
                                    <input type = "password" name = "password" onChange = {this.props.handleInput} required/>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan = "2" align = "center">
                                    <input type = "submit" name = "signin" value = "SIGN IN"/>
                                </td> 
                            </tr>
                        </tbody>
                    </table>
                </form>

            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    // console.log(state);
    return{
        name : state.buyer.name,
        email : state.buyer.email,
        password : state.buyer.password,
        phone: state.buyer.phone,
        state : state.auth
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        handleInput: (e) => dispatch ({type : 'HANDLE_USER_INPUT',"event":e}),
        authf: () => dispatch({type:"AUTH"})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BuyerLogin);
