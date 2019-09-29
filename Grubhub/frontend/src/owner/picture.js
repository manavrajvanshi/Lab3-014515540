import React from 'react';

export default class OwnerPicture extends React.Component{
    render(){
        return(
            <div>
                <h1>Upload Owner Profile Picture</h1>
                <form method="post" enctype="multipart/form-data" action="http://localhost:3001/restaurant/profilePictureUpload">
                    <input type="file" name="ownerProfilePicture"/>
                    <input type="submit" value="Submit"/>
                </form>

                <h1>Upload Restaurant Picture</h1>
                <form method="post" enctype="multipart/form-data" action="http://localhost:3001/restaurant/restaurantPictureUpload">
                    <input type="file" name="restaurantPicture"/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}
