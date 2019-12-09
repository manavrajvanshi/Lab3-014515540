import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';

import {Navbar} from './navbar/navbar.js';
import Welcome from './navbar/welcome.js';
import BuyerLogin from './buyer/login.js';
import BuyerSignup from './buyer/signup.js';
import BuyerHome from './buyer/home.js';
import BuyerUpdate from './buyer/update.js';
import OwnerSignup from './owner/signup.js';
import OwnerLogin from './owner/login.js';
import OwnerHome from './owner/home.js';
import OwnerUpdate from './owner/update.js';
import './App.css';

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql'
});

function App() {
  return (
    <ApolloProvider client = {client}>
      <BrowserRouter>
          <div>    
            <Route path = "/" component={Navbar}/>
            <Route path = "/welcome" component={Welcome}/> 
            <Route path = "/buyerLogin"   component={BuyerLogin}/>
            <Route path = "/buyerSignup"  component={BuyerSignup}/>
            <Route path = "/buyerHome"    component={BuyerHome}/>
            <Route path = "/buyerUpdate"  component={BuyerUpdate}/>
            <Route path = "/ownerLogin"   component = {OwnerLogin}/>
            <Route path = "/ownerSignup"  component={OwnerSignup}/>
            <Route path = "/ownerHome"    component={OwnerHome}/>
            <Route path = "/ownerUpdate"  component = {OwnerUpdate}/>
          </div>
        </BrowserRouter>
      </ApolloProvider>
  );
}

export default App;
