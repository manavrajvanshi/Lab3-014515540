import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';

import {buyerLogin} from './buyer/login.js';
import {buyerSignup} from './buyer/signup';
import {ownerSignup} from './owner/signup.js';
import {ownerLogin} from './owner/login.js';
import './App.css';

function App() {
  return (
    <BrowserRouter>
        <div>    
          <Route path = "/buyerLogin" component={buyerLogin}/>
          <Route path = "/ownerLogin" component = {ownerLogin}/>
          <Route path = "/buyerSignup" component={buyerSignup}/>
          <Route path = "/ownerSignup" component={ownerSignup}/>
        </div>
      </BrowserRouter>
  );
}

export default App;
