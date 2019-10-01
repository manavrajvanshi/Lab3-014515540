import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';

import {Navbar} from './navbar/navbar.js';
import BuyerLogin from './buyer/login.js';
import BuyerSignup from './buyer/signup.js';
import BuyerHome from './buyer/home.js';
import BuyerUpdate from './buyer/update.js';
import BuyerPicture from './buyer/picture.js';
import OwnerSignup from './owner/signup.js';
import OwnerLogin from './owner/login.js';
import OwnerHome from './owner/home.js';
import OwnerUpdate from './owner/update.js';
import OwnerPicture from './owner/picture.js';

import Menu from './restaurant/menu.js';

import './App.css';

function App() {
  return (
    <BrowserRouter>
        <div>    
          <Route path = "/" component={Navbar}/>
          
          <Route path = "/buyerLogin" component={BuyerLogin}/>
          <Route path = "/buyerSignup" component={BuyerSignup}/>
          <Route path = "/buyerHome" component={BuyerHome}/>
          <Route path = "/buyerUpdate" component={BuyerUpdate}/>
          <Route path = "/buyerPicture" component = {BuyerPicture}/>
          <Route path = "/ownerLogin" component = {OwnerLogin}/>
          <Route path = "/ownerSignup" component={OwnerSignup}/>
          <Route path = "/ownerHome" component={OwnerHome}/>
          <Route path = "/ownerUpdate" component = {OwnerUpdate}/>
          <Route path = "/ownerPicture" component = {OwnerPicture}/>

          <Route path = "/menu" component = {Menu} />
        </div>
      </BrowserRouter>
  );
}

export default App;
