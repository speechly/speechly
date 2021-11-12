import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import LogRocket from 'logrocket';

// LogRocket
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  if (process.env.REACT_APP__LOGROCKET_TOKEN_DEV) {
      console.log("Enabling LogRocket logging in Dev build")
      LogRocket.init(process.env.REACT_APP__LOGROCKET_TOKEN_DEV);
  } else {
      console.log("Skipping LogRocket logging in Dev build - env REACT_APP__LOGROCKET_TOKEN_DEV not set")
  }
} else {
  if (process.env.REACT_APP__LOGROCKET_TOKEN_PROD) {
      LogRocket.init(process.env.REACT_APP__LOGROCKET_TOKEN_PROD);
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
