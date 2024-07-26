import React from 'react';
import logo from '../assets/bageera-01.svg';
import '../styles/common.css';

const Logo = () => {
  return (
    <div className='Logo'>
      <img src={logo} height='20px' alt="Company Logo" />
    </div>
  );
};

export default Logo;
