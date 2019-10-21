import React from 'react';
import {Redirect} from 'react-router-dom';
import cookie from 'react-cookies';
import '../App.css';

var enVar = require ('../enVar.js');
const nodeAddress = enVar.nodeAddress;

export default class OwnerPicture extends React.Component{
    render(){
        let ree = null;
        if(cookie.load('authCookieo') !== 'authenticated'){
            ree = <Redirect to ="/welcome"/>
        }
        return(
            <div className = "pictureContainer">
                {ree}
                <h2 className = "hdng">Add / Update Profile Picture</h2>
                <form style={{textAlign:"center"}} method="post" enctype="multipart/form-data" action={nodeAddress+'restaurant/profilePictureUpload'}>
                    <input className = "inp" type="file" name="ownerProfilePicture"/>
                    <input className = "bttn" type="submit" value="Submit"/>
                </form>

                <h2 className = "hdng">Add / Update Restaurant Picture</h2>
                <form style={{textAlign:"center"}} method="post" enctype="multipart/form-data" action={nodeAddress+'restaurant/restaurantPictureUpload'}>
                    <input className = "inp" type="file" name="restaurantPicture"/>
                    <input className = "bttn" type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}
