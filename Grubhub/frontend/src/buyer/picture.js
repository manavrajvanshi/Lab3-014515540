import React from 'react';

class BuyerPicture extends React.Component{
    render(){
        return(
            <div>
                <form method="post" encType="multipart/form-data" action="http://localhost:3001/buyer/profilePictureUpload">
                    <input type="file" name="buyerProfilePicture"/>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}

export default BuyerPicture;