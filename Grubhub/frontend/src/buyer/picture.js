import React from 'react';
import cookie from 'react-cookies';
import {Redirect} from 'react-router-dom';
import '../App.css';


let re = null;

class BuyerPicture extends React.Component{
    
    render(){
        if(cookie.load('authCookieb') !== "authenticated" ){
            re = <Redirect to = "/buyerLogin"/>
            console.log("Inside Else");
        }
        
        return(
           
            <div className = "pictureContainer">
                {re}
                <h2 className = "hdng">Add / Update Profile Picture</h2>
                <form style={{textAlign:"center"}} method="post" encType="multipart/form-data" action="http://localhost:3001/buyer/profilePictureUpload">
                    <input className = "inp" type="file" name="buyerProfilePicture"/>
                    <input className = "bttn" type="submit" value="Upload"/>
                </form>
            </div>
        );
    }
}

export default BuyerPicture;