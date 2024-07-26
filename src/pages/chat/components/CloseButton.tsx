import React from 'react';

import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { red } from '@mui/material/colors';

const CloseButton = (props: { handleOpenDialog: Function }) => {
  const { handleOpenDialog } = props;
  return (
    <IconButton
      onClick={() => handleOpenDialog()}
      sx={{
        marginRight: '5px',
        marginTop: '5px',
        position: 'absolute',
        top: ' 8px',
        right: { xs: '8px', md: '78px' },
        color: 'white',
        backgroundColor: red[400],
        ':hover': {
          color: 'white', // Change the color on hover
          backgroundColor: red[700], // Remove the default hover background color
        },
        '& .MuiSvgIcon-root': {
          fontSize: '1rem', // Change the icon size by adjusting the fontSize
        },
      }}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default CloseButton;
