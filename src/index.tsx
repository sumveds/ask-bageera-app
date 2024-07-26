import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Auth0Provider
    domain='dev-grekqp1gdk7jbvov.us.auth0.com'
    clientId='raEoYn2Fg0bql9fuLKZlXFaxVA0h5FMd'
    authorizationParams={{
      redirect_uri: window.location.origin 
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);
