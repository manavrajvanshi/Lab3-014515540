import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux'; 

class BuyerSignup extends React.Component{

    constructor(props){
        super(props);
     
        this.signup = this.signup.bind(this);
    }

    signup(e){
        e.preventDefault();
        const data = {
            name : this.props.name,
            email : this.props.email,
            password : this.props.password,
        }

        if( data.name === "" || data.email === "" || data.password === ""){
            console.log("Invalid data, Cannot signup");
        }else{
            
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/buyer/signup',data)
                .then(response => {
                    if(response.status === 200){
                        alert("Sucessfully Signed Up, please update your profile after logging in.");
                    }else if(response.status === 201){
                        alert("Error Signing up.");
                        console.log(response.data);
                    }else if(response.status === 202){
                        alert(response.data);
                    }
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error.data));
                }
            );
        }
        
    }
    render(){
        return(
            <div>
                <form onSubmit = {this.signup}>
                    <table border = "0">
                        <tbody>
                            <tr>
                                <td>
                                    Name: 
                                </td>
                                <td>
                                    <input type = "text" name = "name" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.props.handleInput} value = {this.props.name} autoFocus required/>
                                </td>
                            </tr>

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
                                    <input type = "password" name = "password" onChange = {this.props.handleInput} required />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan = "2" align = "center">
                                    <input type = "submit" name = "signup" value = "SIGN UP"/>
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
        name : state.buyer.name,
        email : state.buyer.email,
        password : state.buyer.password,
        phone: state.buyer.phone
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        handleInput: (e) => dispatch ({type : 'HANDLE_USER_INPUT',"event":e})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BuyerSignup);
