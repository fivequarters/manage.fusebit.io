import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import SnackProvider from './components/common/SnackProvider';
import Session from './Session';

const session = new URLSearchParams(window.location.search).get('session');
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    {session ? (
      <Session session={session} />
    ) : (
      <SnackProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </SnackProvider>
    )}
  </React.StrictMode>,
  document.getElementById('root')
);
