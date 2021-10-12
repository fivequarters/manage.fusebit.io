import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import Session from './Session';

const session = new URLSearchParams(window.location.search).get('session');
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    {session ? (
      <Session session={session} />
    ) : (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )}
  </React.StrictMode>,
  document.getElementById('root')
);
