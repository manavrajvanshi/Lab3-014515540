import React from 'react';
import {Redirect} from 'react-router';

let re;
export default class ShowRestaurants extends React.Component{
    constructor(props){
        super(props);
        this.viewRestaurant = this.viewRestaurant.bind(this);
     
    }
    
    viewRestaurant(e){
        re = <Redirect to={{
            pathname : '/order',
            rid : e.target.value,
            state : {rid : e.target.value}
          }} />;
        this.setState({});
    }
    render(){
        let restaurantsTable = [];
        let foundFlag = false;
        //console.log(this.props.cuisineFilter);
        for(let restaurant in this.props.restaurantsList){
        
            if(this.props.cuisineFilter === ''){
                foundFlag = true;
                restaurantsTable.push(
                
                    <tr key = {this.props.restaurantsList[restaurant].rid} >
                        <td>{this.props.restaurantsList[restaurant].restaurantName}</td>
                        <td>{this.props.restaurantsList[restaurant].cuisine}</td>
                        <td><button onClick = {this.viewRestaurant} value ={this.props.restaurantsList[restaurant].rid}>View</button></td>
                    </tr>
                )
            }else{
                
                console.log("Filter ");
                if(this.props.restaurantsList[restaurant].cuisine.toLowerCase() === this.props.cuisineFilter.toLowerCase()){
                    foundFlag = true;
                    restaurantsTable.push(
                        
                        <tr key = {this.props.restaurantsList[restaurant].rid} >
                            <td>{this.props.restaurantsList[restaurant].restaurantName}</td>
                            <td>{this.props.restaurantsList[restaurant].cuisine}</td>
                            <td><button onClick = {this.viewRestaurant} value ={this.props.restaurantsList[restaurant].rid}>View</button></td>
                        </tr>
                    )
                }
            }
            
        }

        if(!foundFlag){
            return <div>No restaurants with your cuisine choice found</div>
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