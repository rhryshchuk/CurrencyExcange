import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './component/header.js'
import Exchange from './component/exchange.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <Exchange />
  </React.StrictMode>
);
