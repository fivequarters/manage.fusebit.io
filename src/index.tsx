import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Session from './Session';

const session = new URLSearchParams(window.location.search).get('session');

ReactDOM.render(
  <React.StrictMode>{session ? <Session session={session} /> : <App />}</React.StrictMode>,
  document.getElementById('root')
);
