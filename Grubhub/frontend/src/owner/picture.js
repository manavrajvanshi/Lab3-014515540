import React from 'react';
import '../App.css';

export default class OwnerPicture extends React.Component{
    render(){
        return(
            <div className = "pictureContainer">
                <h2 className = "hdng">Add / Update Profile Picture</h2>
                <form style={{textAlign:"center"}} method="post" enctype="multipart/form-data" action="http://localhost:3001/restaurant/profilePictureUpload">
                    <input className = "inp" type="file" name="ownerProfilePicture"/>
                    <input className = "bttn" type="submit" value="Submit"/>
                </form>

                <h2 className = "hdng">Add / Update Restaurant Picture</h2>
                <form style={{textAlign:"center"}} method="post" enctype="multipart/form-data" action="http://localhost:3001/restaurant/restaurantPictureUpload">
                    <input className = "inp" type="file" name="restaurantPicture"/>
                    <input className = "bttn" type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}
