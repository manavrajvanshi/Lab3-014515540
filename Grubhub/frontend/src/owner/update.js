import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
let re = null;
class OwnerUpdate extends React.Component{

    constructor(props){
        super(props);
        this.update = this.update.bind(this);
    }

    update(e){
        e.preventDefault();
        const data = {
            ownerName : this.props.ownerName,
            ownerEmail : this.props.ownerEmail,
            ownerPassword : this.props.ownerPassword,
            ownerPhone : this.props.ownerPhone,
            rid : cookie.load('ownerData').rid,
            cuisine : this.props.cuisine,
            restaurantName : this.props.restaurantName,
            restaurantZip : this.props.restaurantZip
        }
        console.log(data);
        if( data.ownerName === "" || data.ownerEmail === "" || data.ownerPassword === ""){
            console.log("Invalid data, Cannot Update");
        }else{
            // console.log("HEREEEE")
            axios.defaults.withCredentials = true;
            //make a post request with the user data
            axios.post('http://localhost:3001/restaurant/update',data)
                .then(response => {
                    console.log(response.data);
                    this.forceUpdate();
                    if(response.status === 200){
                        alert("Profile Updated");
                        this.forceUpdate();
                    }else if( response.status === 201){
                        alert("Data not updated, contact support team.");
                        console.log(response.data);
                    }else if(response.status === 202){
                        console.log("Data not updated, contact support team.");
                    }
                    else if(response.status === 203){
                        alert(response.data);
                    }
                }).catch(error=>{
                    console.log("Error: "+JSON.stringify(error));
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
                                   Owner Name: 
                                </td>
                                <td>
                                    <input type = "text" name = "ownerName" pattern = "[A-Za-z ]+" title="Alphabets Only" onChange = {this.props.handleInput} value = {this.props.ownerName} autoFocus    />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Owner Email: 
                                </td>
                                <td>
                                    <input type = "email" name = "ownerEmail" onChange = {this.props.handleInput} value = {this.props.ownerEmail} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Owner Password: 
                                </td>
                                <td>
                                    <input type = "password" name = "ownerPassword" onChange = {this.props.handleInput} value = {this.props.ownerPassword}  />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Owner Phone: 
                                </td>
                                <td>
                                    <input type = "number" name = "ownerPhone" onChange = {this.props.handleInput} value = {this.props.ownerPhone} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Restaurant Name: 
                                </td>
                                <td>
                                    <input type = "text" name = "restaurantName" onChange = {this.props.handleInput} value = {this.props.restaurantName} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Restaurant Zip: 
                                </td>
                                <td>
                                    <input type = "text" name = "restaurantZip" onChange = {this.props.handleInput} value = {this.props.restaurantZip} />
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Cuisine: 
                                </td>
                                <td>
                                    <input type = "text" name = "cuisine" onChange = {this.props.handleInput} value = {this.props.cuisine} />
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
        ownerName : state.owner.ownerName,
        ownerEmail : state.owner.ownerEmail,
        ownerPassword : state.owner.ownerPassword,
        ownerPhone: state.owner.ownerPhone,
        restaurantName: state.owner.restaurantName,
        restaurantZip : state.owner.restaurantZip,
        cuisine : state.owner.cuisine
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        handleInput: (e) => dispatch ({type : 'HANDLE_OWNER_INPUT',"event":e})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(OwnerUpdate);