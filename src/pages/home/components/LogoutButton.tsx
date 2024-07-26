import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './loginButton.css';

const LogoutButton: React.FC = () => {
  const {isAuthenticated,logout,} = useAuth0();

  return isAuthenticated && (
    <button onClick={() => {
      logout({ 
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    }} className='loginButton'>Log out</button>
  ) || null;
}
export default LogoutButton;

