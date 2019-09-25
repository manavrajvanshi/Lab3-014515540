import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import {connect} from 'react-redux'; 

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
        console.log(data); 
        if(  data.email === "" || data.password === ""){

            console.log(data.email);
            console.log(data.password);
            console.log("Invalid data, Cannot Login");
        }else{
            
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/buyer/signin',data)
                .then(response => {
                    console.log(cookie.load('buyerData'));
                    if( cookie.load('authCookie') === "authenticated"){
                        this.forceUpdate();
                    }
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
                });
        }
        
    }
    render(){
        let redirect = null;
        if (cookie.load('authCookie')==="authenticated"){
            redirect = <Redirect to = "/buyerHome"/>
        }
        return(
            <div>
                {redirect}
                
                <form onSubmit = {this.login}>
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
    console.log(state);
    return{
        name : state.buyer.name,
        email : state.buyer.email,
        password : state.buyer.password,
        phone: state.buyer.phone
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        handleInput: (e) => dispatch ({type : 'HANDLE_USER_INPUT',"event":e}),
        auth: () => dispatch({type:"AUTH"})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BuyerLogin);
