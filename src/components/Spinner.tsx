import * as React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { orange } from '@mui/material/colors';

const Spinner = () => {
  return (
    <Box 
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: orange[500]
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
