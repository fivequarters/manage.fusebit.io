import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Session from './Session';

const session = new URLSearchParams(window.location.search).get('session');

ReactDOM.render(
  <React.StrictMode>
    {session ? (
      <Session session={session} />
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>,
  document.getElementById('root')
);
