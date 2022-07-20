import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from 'web3uikit';



ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider appId={process.env.REACT_APP_appId} serverUrl={process.env.REACT_APP_serverUrl}>
    <MoralisProvider appId="IECBbRIOTV9bT7M2sbcf0ZE6jdMmuAkOpBufU6aO" serverUrl="https://jal8fchjfvo2.usemoralis.com:2053/server">
      <NotificationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </NotificationProvider>
    </MoralisProvider>
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
