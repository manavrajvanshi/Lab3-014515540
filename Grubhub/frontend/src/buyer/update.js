import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {connect} from 'react-redux'; 
import {Redirect} from 'react-router';
let re = null;
class BuyerUpdate extends React.Component{

    constructor(props){
        super(props);      
        this.update = this.update.bind(this);
    }

    update(e){
        e.preventDefault();
        const data = {
            name : this.props.name,
            email : this.props.email,
            password : this.props.password,
            phone : this.props.phone,
            bid : cookie.load('buyerData').bid
        }

        if( data.name === "" || data.email === "" || data.password === ""){
            console.log("Invalid data, Cannot Update");
        }else{
            console.log(JSON.stringify(this.state));
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/buyer/update',data)
                .then(response => {
                    this.forceUpdate();
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error.data));
                }
            );
        }
        
    }
    render(){
        if(cookie.load('authCookie') !== "authenticated" ){
            re = <Redirect to = "/"/>
            console.log("Inside Else");
        }
        return(
            <div>
                {re}
                <form onSubmit = {this.update}>
                    <table border = "0">
                        <tbody>
                            <tr>
                                <td>
                                    Name: 
                                </td>
                                <td>
                                    <input type = "text" name = "name" onChange = {this.props.handleInput} value = {this.props.name}  autoFocus required/>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Email: 
                                </td>
                                <td>
                                    <input type = "email" name = "email" onChange = {this.props.handleInput} value = {this.props.email}  required/>
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
                                <td>
                                    Phone: 
                                </td>
                                <td>
                                    <input type = "number" name = "phone" onChange = {this.props.handleInput} value = {this.props.phone} />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan = "2" align = "center">
                                    <input type = "submit" name = "update" value = "UPDATE"/>
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
        phone : state.buyer.phone
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        handleInput: (e) => dispatch ({type : 'HANDLE_USER_INPUT',"event":e})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BuyerUpdate);