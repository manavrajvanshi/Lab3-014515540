import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

class OwnerSignup extends React.Component{

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
            restaurantName : this.props.restaurantName,
            restaurantZip : this.props.restaurantZip
        }
        console.log(data);
        if( data.name === "" || data.email === "" || data.password === ""){
            console.log("Invalid data, Cannot signup");
        }else{
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/restaurant/signup',data)
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
                                    <input type = "password" name = "password" onChange = {this.props.handleInput}  value = {this.props.password}required />
                                </td>
                            </tr>

                            
                            <tr>
                                <td>
                                    Restaurant Name: 
                                </td>
                                <td>
                                    <input type = "text" name = "restaurantName" onChange = {this.props.handleInput}  value = {this.props.restaurantName} required />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Restaurant Zip: 
                                </td>
                                <td>
                                    <input type = "number" name = "restaurantZip" onChange = {this.props.handleInput}  value = {this.props.restaurantZip}required />
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
        name : state.owner.name,
        email : state.owner.email,
        password : state.owner.password,
        phone: state.owner.phone,
        restaurantName: state.owner.restaurantName,
        restaurantZip : state.owner.restaurantZip
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        handleInput: (e) => dispatch ({type : 'HANDLE_OWNER_INPUT',"event":e})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(OwnerSignup);