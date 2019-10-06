import React from 'react';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';
import Cookies from 'universal-cookie';
import axios from 'axios';

import '../App.js';
const cookies = new Cookies();
let re = null;
export default class Menu extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            auth: false,
            name:'',
            description : '',
            price: '',
            selectedFile: null,
            newSectionName:'',

            nameUpdate:'',
            descriptionUpdate:'',
            sectionUpdate:'',
            priceUpdate:''
        }
        this.data = [];
        this.deleteSection = this.deleteSection.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.addItem = this.addItem.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.updateSection = this.updateSection.bind(this);
        this.showEdit = this.showEdit.bind(this);
        this.editItem = this.editItem.bind(this);
        this.handleInputEdit = this.handleInputEdit.bind(this);
    }
    editItem(element){
        
        let iid = element.iid;
        let nameUpdate = this.state.nameUpdate;
        let descriptionUpdate = this.state.descriptionUpdate;
        let sectionUpdate = this.state.sectionUpdate;
        let priceUpdate = this.state.priceUpdate;
        if(nameUpdate === ""){
            nameUpdate = element.name;
        }
        if(descriptionUpdate === ""){
            descriptionUpdate = element.description;
        }
        if(sectionUpdate === ""){
            sectionUpdate = element.section;
        }
        if(priceUpdate === ""){
            priceUpdate = element.price;
        }
        
        let data = {
            iid:iid,
            nameUpdate:nameUpdate,
            descriptionUpdate:descriptionUpdate,
            sectionUpdate:sectionUpdate,
            priceUpdate:priceUpdate
        }


        console.log(data);

        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/restaurant/updateItem',data)
        .then(response => {
            if(response.status === 200 ){
                console.log("Item Updated");
                window.location.reload();
            }
        })
        .catch(error => console.log("Error"));
        
    }
    showEdit(e){
        var row = document.getElementById(e.target.value);
        if (row.style.display === "none") {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }

    handleInputEdit(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    updateSection(e){
        let oldSection = e.target.name;
        let newSectionName = this.state.newSectionName;
        let rid = cookie.load('ownerData').rid;

        let data = {
            oldSection:oldSection,
            newSectionName:newSectionName,
            rid:rid
        }
        if(newSectionName !== ''){
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/restaurant/updateSection',data)
            .then(response => {
                if(response.status === 200 ){
                    console.log("Section Updated");
                    window.location.reload();
                }
            })
            .catch(error => console.log("Error"));
        }else{
            alert("Enter a Section Name")
        }
        

        
    }

    onImageChange(e){
        this.setState({
            selectedFile: e.target.files[0],
        },()=>{
            console.log(this.state.selectedFile);
        })
    }

    uploadImage(e){
        cookies.set('item', e.target.value);
        console.log(e.target.value);
        const data = new FormData();
        data.append('itemImage', this.state.selectedFile);
        axios.post("http://localhost:3001/restaurant/itemImage", data)
        .then(res => { 
            
            this.setState({
                selectedFile: null,
            },()=>{
                window.location.reload();
            })
       
      }).catch(error => {
          console.log("ERRRROOORRR");
        });
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
            <th>Item Image</th>
            <th>Item Name</th>
            <th>Description</th>
            <th>Section</th>
            <th>Price</th>
            <th>Add / Delete</th>
            <th>Image Upload</th>
        </tr>
        );
        itemsArray.push(   
            <tr> 
                <td></td>           
                <td><input class = "inp" type = "text" name = "item" onChange = {this.handleInput} value = {this.state.item}/></td>
                <td><input class = "inp" type = "text" name = "description" onChange = {this.handleInput} value = {this.state.description}/></td>
                <td><input class = "inp" type = "text" name = "section" onChange = {this.handleInput} value = {this.state.section}/></td>
                <td><input class = "inp" type = "text" name = "price" onChange = {this.handleInput} value = {this.state.price}/></td>
                <td colSpan = "2"><input class = "bttn" type = "Submit" value = "Add Item"/></td>
            </tr>
        );

        if(this.data.length > 0){

            sections.forEach(
                section =>{

                    itemsArray.push(
                        <tr>
                            <th class = "hdng" colSpan = "3"> 
                                {section}
                            </th>
                            <th>
                                <button className ="inp" onClick = {this.deleteSection} value = {section}>Remove Section</button>
                            </th>
                            <th colSpan = "2">
                                <input className = "inp" onChange = {this.handleInput} name = {section} />
                            </th>
                            <th>
                                <button className ="inp" onClick = {this.updateSection} name = {section}>Update Section</button>
                            </th>
                        </tr>
                    )

                    this.data.forEach(
                        element =>{
                            if (element.section === section){
                                 //console.log(element)

                                itemsArray.push(
                                    <tr>
                                        <td><img className = "itemImage" src = {"http://localhost:3001/item/"+element.iid+".jpg"} width ="200" height = "200" alt = 'food'/></td>
                                        <td className = "hdng">{element.name}</td>
                                        <td className = "hdng">{element.description}</td>
                                        <td className = "hdng">{element.section}</td>
                                        <td className = "hdng">{element.price}</td>
                                        <td className = "hdng"><button class = "bttn" value = {element.iid} onClick = {this.handleDelete}>Delete</button></td>
                                        <td><input onChange ={this.onImageChange} name = "itemImage" type = "file"/><br></br>
                                            <button value = {element.iid} onClick = {this.uploadImage}>Image Upload</button><br></br>
                                            <button value = {element.iid} onClick = {this.showEdit}>Edit</button>
                                        </td>
                                    </tr>
                                )

                                itemsArray.push(
                                    <tr style = {{display:"none"}} id = {element.iid}>
                                        <td className = "hdng">Enter Details</td>
                                        <td className = "hdng"><input class = "inp" type = "text" defaultValue = {element.name} onChange = {this.handleInputEdit} name = "nameUpdate"/></td>
                                        <td className = "hdng"><input class = "inp" type = "text" defaultValue = {element.description} onChange = {this.handleInputEdit} name = "descriptionUpdate"/></td>
                                        <td className = "hdng"><input class = "inp" type = "text" defaultValue = {element.section} onChange = {this.handleInputEdit} name = "sectionUpdate"/></td>
                                        <td className = "hdng"><input class = "inp" type = "text" defaultValue = {element.price} onChange = {this.handleInputEdit} name = "priceUpdate"/></td>
                                        <td colSpan = "2"><button class = "bttn" onClick = {()=>this.editItem(element)}>Edit</button></td>
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
        
        if(cookie.load('authCookieo') !== 'authenticated'){
            re = <Redirect to = '/ownerLogin'/>
        }else{
            
        }
        return (
            <div className = "menuContainer">
                {re}
                <h4 className = "hdng">Add Items to the menu. Sections will be added & removed automatically.</h4>
                <form onSubmit = {this.addItem}>
                

                    
                    <table className = "menu">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                        
                    </table>
                </form>
            </div>
        )
    }
}