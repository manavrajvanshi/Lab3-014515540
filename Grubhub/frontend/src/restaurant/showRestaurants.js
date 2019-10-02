import React from 'react';
import {Redirect} from 'react-router';

let re;
export default class ShowRestaurants extends React.Component{
    constructor(props){
        super(props);
        this.viewRestaurant = this.viewRestaurant.bind(this);
    }

    viewRestaurant(e){
        alert(e.target.value);
        re = <Redirect to={{
            pathname : '/order',
            rid : e.target.value,
            state : {rid : e.target.value}
          }} />;
        this.setState({});
    }
    render(){
        let restaurantsTable = [];
       
        for(let restaurant in this.props.restaurantsList){
        
           
            restaurantsTable.push(
                
                <tr >
                    <td>{this.props.restaurantsList[restaurant].restaurantName}</td>
                    <td>{this.props.restaurantsList[restaurant].cuisine}</td>
                    <td><button onClick = {this.viewRestaurant} value ={this.props.restaurantsList[restaurant].rid}>View</button></td>
                </tr>
            )
        }

        return(
            <div>
                {re}
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