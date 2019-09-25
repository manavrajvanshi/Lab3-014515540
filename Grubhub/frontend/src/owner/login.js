import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import {connect} from 'react-redux'; 

class OwnerLogin extends React.Component{

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

        if(  data.email === "" || data.password === ""){
            console.log("Invalid data, Cannot Login");
        }else{
            
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/restaurant/signin',data)
                .then(response => {
                    console.log(cookie.load('ownerData'));
                    if( cookie.load('authCookie') === "authenticated"){
                        this.forceUpdate();
                    }else{
                        
                    }
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
                }
            );
        }
        
    }
    render(){

        let redirect = null;
        if (cookie.load('authCookie')==="authenticated"){
            redirect = <Redirect to = "/ownerHome"/>
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
    return{
        name : state.owner.name,
        email : state.owner.email,
        password : state.owner.password,
        phone: state.owner.phone
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        handleInput: (e) => dispatch ({type : 'HANDLE_OWNER_INPUT',"event":e})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(OwnerLogin);