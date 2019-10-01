import React from 'react';

export default class ShowRestaurants extends React.Component{

    render(){
        let restaurantsTable = [];
       
        for(let restaurant in this.props.restaurantsList){
        
            
            restaurantsTable.push(
                <tr>
                    <td><a href ="/buyerUpdate">{this.props.restaurantsList[restaurant].restaurantName}</a></td>
                    <td>{this.props.restaurantsList[restaurant].cuisine}</td>
                </tr>
            )
        }

        return(
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Restaurants serving {this.props.searchItem}</th>
                            <th>Cuisine</th>
                        </tr>
                    </thead>

                    <tbody>
                        {restaurantsTable}
                    </tbody>
                </table>
            </div>

        );
    }
}