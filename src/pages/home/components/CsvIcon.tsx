import React from 'react';
import { ChangeEvent } from 'react';
import { Button } from '@mui/material';
import CsvSvg from '../../../assets/icons/csv.svg';
import '../styles/Home.css';
import { ButtonStyle } from '../styles/ButtonStyle';
import { useAuth0 } from '@auth0/auth0-react';

interface CsvIconProps {
  onChange: (file: File) => void;
}

export default function CsvIcon({ onChange }: CsvIconProps) {
  const{isAuthenticated, loginWithRedirect }= useAuth0();
  const handleCsvUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!isAuthenticated) {
      alert('You need to login first');
      loginWithRedirect();
      return;
    }
    
    if (files && files.length) {
      onChange(files[0]);
    }
  };
  
  return (
    <div>
      <div className='Icons-Svg'>
        <Button component='label' style={ButtonStyle.STYLE} variant="contained">
          <img src={CsvSvg} width={80} height={80} alt='CSV icon' />
          <input type='file' accept='.csv' hidden onChange={handleCsvUpload} />
        </Button>
      </div>
      <div className='Icons-Label'>
        Upload CSV
      </div>
    </div>
  );
}
