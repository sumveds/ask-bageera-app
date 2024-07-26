import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './loginButton.css';

const LoginButton: React.FC = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
  } = useAuth0();

  return (
    <>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()} className= 'loginButton'>Log In</button>
      )}
    </>
  );
};

export default LoginButton;
