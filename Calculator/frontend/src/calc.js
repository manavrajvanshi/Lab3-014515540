import React from 'react';
import axios from 'axios';
import './Calc.css'



export class Calc extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            query : ""
        }

        this.handleClick = this.handleClick.bind(this);
        this.calculate = this.calculate.bind(this);
        this.clear = this.clear.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    clear(){
        this.setState({
            query : ""
        })
    }
    handleClick(e){
        let val = this.state.query;
        let current = e.target.value;
        if( current === "+" || current === "-" || current === "/" || current ==="*" || current ==="." ){
            if( val [val.length -1] !== "+" && val [val.length -1] !== "-" && val [val.length -1] !== "*" && val [val.length -1] !== "/" && val [val.length -1] !== "."){
                this.setState({
                    query : val+current
                })
            }
        }else {
            this.setState({
                query : val+current
            })
        }
        
    }

    handleEnter(e){
        if( e.key === 'Enter'){
            this.calculate();
        }
    }

    handleInput(e){
        let val = this.state.query;
        let current = e.target.value;
        if( current[current.length -1] === "+" || current[current.length -1] === "-" || current[current.length -1] === "/" || current[current.length -1] ==="*" || current[current.length -1] ==="." ){
            if( val [val.length -1] !== "+" && val [val.length -1] !== "-" && val [val.length -1] !== "*" && val [val.length -1] !== "/" && val [val.length -1] !== "."){
                this.setState({
                    query : current
                })
            }
        }else {
            this.setState({
                query : current
            })
        }
    }
    
    
    calculate(){

        let data = {
            query : this.state.query
        }
        axios.post('http://localhost:3001/',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("Respose: ", response)
                if(response.status === 200){
                    this.setState({
                        query : response.data,
                        
                    })
                }
            }).catch(error=>{
                console.log("Error");
            });
    }


    render(){


        return(

            
            
            <div>
                
                <h1>CALCULATOR APP</h1>
             
                <table>
                    
                    <tbody>

                        <tr>
                            <td  colspan = "5">
                                <input type = "text" value = {this.state.query} name = "query" onChange = {this.handleInput}  onKeyDown = {this.handleEnter} />
                            </td>
                            <td>
                                <button value ="=" onClick = {this.calculate}>=</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <button style = {Calc.css}value ="(" name ="(" onClick = {this.handleClick}>(</button>
                            </td>
                            <td>
                                <button value ="*"  onClick = {this.handleClick}>*</button>
                            </td>
                            <td>
                                <button value ="/" onClick = {this.handleClick}>/</button>
                            </td>
                            <td>
                                <button value ={7}  onClick = {this.handleClick}>7</button>
                            </td>
                            <td>
                                <button value ={8}  onClick = {this.handleClick}>8</button>
                            </td>
                            <td>
                                <button value ={9}  onClick = {this.handleClick}>9</button>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <button value =")"  onClick = {this.handleClick}>)</button>
                            </td>
                            <td>
                                <button value ="+"  onClick = {this.handleClick}>+</button>
                            </td>
                            <td>
                                <button value ="-"  onClick = {this.handleClick}>-</button>
                            </td>
                            <td>
                                <button value ={4}  onClick = {this.handleClick}>4</button>
                            </td>
                            <td>
                                <button value ={5}  onClick = {this.handleClick}>5</button>
                            </td>
                            <td>
                                <button value ={6}  onClick = {this.handleClick}>6</button>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <button value = "Clear"  onClick = {this.clear}>C</button>
                            </td>
                            <td>
                                <button value ="."  onClick = {this.handleClick}>.</button>
                            </td>
                            <td>
                                <button value ={0}  onClick = {this.handleClick}>0</button>
                            </td>
                            <td>
                                <button value ={1}  onClick = {this.handleClick}>1</button>
                            </td>
                            <td>
                                <button value ={2}  onClick = {this.handleClick}>2</button>
                            </td>
                            <td>
                                <button value ={3}  onClick = {this.handleClick}>3</button>
                            </td>
                        </tr>
                    </tbody>
                    
                </table>
            </div>
        )
    }

}