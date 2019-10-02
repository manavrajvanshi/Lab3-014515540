import React from 'react';
import {Redirect} from 'react-router';
import cookie from 'react-cookies';

export default class Order extends React.Component{
    render(){
        console.log(this.props.location);
        if(cookie.load('authCookie')!=='authenticated'){
            let re = <Redirect to ="/buyerLogin"></Redirect>
            return re
        }
        return(
            <div>
                Hello, This is your orders page for RID {this.props.location.state.rid}
            </div>
        )
    }
}

