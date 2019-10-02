import React from 'react';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import axios from 'axios';

let re = null;
export default class Menu extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            auth: false,
            name:'',
            description : '',
            price: '',
        }
        this.data = [];
        this.deleteSection = this.deleteSection.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.addItem = this.addItem.bind(this);
        
    }
    deleteSection(e){
        let data = {
            rid : cookie.load('rid'),
            section : e.target.value
        }

        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/restaurant/deleteSection',data)
        .then(response => {
            if(response.status === 200 ){
                console.log("Section Deleted");
                window.location.reload();
            }
        })
        .catch(error => console.log("Error"));

    }
    handleInput(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleDelete(e){
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/restaurant/deleteMenuItem',{iid:e.target.value})
        .then(response => {
            if(response.status === 200 ){
                console.log("Item Deleted");
                window.location.reload();
            }
        })
        .catch(error => console.log("Error"));
    }

    addItem (e){
        e.preventDefault();

        let itemData = {
            name: this.state.item,
            description : this.state.description,
            price: this.state.price,
            section : this.state.section,
            rid : cookie.load('ownerData').rid
        }

        axios.defaults.withCredentials = true;

        if( itemData.name !== '' && itemData.description !== '' && itemData.price !== '' && itemData.section !== ''){
            axios.post('http://localhost:3001/restaurant/addItem',itemData)
            .then(response => {
                if(response.status === 200 ){
                    window.location.reload();
                }else{
                    console.log("Item Not Added");
                }
            }).catch(error => console.log(error));
        }
        
        
    }

    componentDidMount(){
        axios.defaults.withCredentials = true;

        axios.get('http://localhost:3001/restaurant/menu',{})
        .then(response => {
            this.data = response.data;
            this.setState({})
            
        }).catch(error => console.log(error));
    }

    createTable(){
        let itemsArray = [];    

        let sections = new Set();

        for( let item in this.data){
            sections.add(this.data[item].section)
        }
        itemsArray.push(
            
        <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Section</th>
            <th>Price</th>
            <th>Add / Delete</th>
        </tr>
        );
        itemsArray.push(   
            <tr>            
                <td><input type = "text" name = "item" onChange = {this.handleInput} value = {this.state.item}/></td>
                <td><input type = "text" name = "description" onChange = {this.handleInput} value = {this.state.description}/></td>
                <td><input type = "text" name = "section" onChange = {this.handleInput} value = {this.state.section}/></td>
                <td><input type = "text" name = "price" onChange = {this.handleInput} value = {this.state.price}/></td>
                <td><input type = "Submit" value = "Add"/></td>
            </tr>
        );

        if(this.data.length > 0){

            sections.forEach(
                section =>{

                    itemsArray.push(
                        <tr>
                            <th>
                                {section}
                            </th>
                            <th>
                                <button onClick = {this.deleteSection} value = {section}>Remove Section</button>
                            </th>
                            <th>
                                <button onClick = {this.updateSection} value = {section}>Update Section</button>
                            </th>
                        </tr>
                    )
                    this.data.forEach(
                        element =>{
                            if (element.section === section){
                                // console.log(element.name)

                                itemsArray.push(
                                    <tr>
                                        <td>{element.name}</td>
                                        <td>{element.description}</td>
                                        <td>{element.section}</td>
                                        <td>{element.price}</td>
                                        <td><button value = {element.iid} onClick = {this.handleDelete}>Delete</button></td>
                                    </tr>
                                )
                            }
                        }
                    )
                }
            )            
        }
        
        return itemsArray;
    }
    
    render(){
        
        if(cookie.load('authCookie') !== 'authenticated'){
            re = <Redirect to = '/ownerLogin'/>
        }else{
            
        }
        return (
            <div>
                {re}
                <form onSubmit = {this.addItem}>
                    <table>
                        <tbody>
                        {this.createTable()}
                        </tbody>
                        
                    </table>
                </form>
            </div>
        )
    }
}