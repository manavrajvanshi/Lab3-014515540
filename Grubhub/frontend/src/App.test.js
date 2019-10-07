import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import BuyerLogin from './buyer/login.js';
import {Navbar} from './navbar/navbar.js';
import Welcome from './navbar/welcome.js';

it('renders buyer login container', () => {
  const originalError = console.error;
  console.error = jest.fn();
  const div = document.createElement('div.loginContainer');
  ReactDOM.render(<BuyerLogin />, div);
  ReactDOM.unmountComponentAtNode(div);
  console.error = originalError;
});

it('renders navbar', () => {
  const originalError = console.error;
  console.error = jest.fn();
  const div = document.createElement('div.topnav');
  ReactDOM.render(<Navbar />, div);
  ReactDOM.unmountComponentAtNode(div);
  console.error = originalError;
});

it('renders welcome page', () => {
  const originalError = console.error;
  console.error = jest.fn();
  const div = document.createElement('div.welcomepage');
  ReactDOM.render(<Welcome />, div);
  ReactDOM.unmountComponentAtNode(div);
  console.error = originalError;
});
