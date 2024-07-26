import React from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';

const SessionEndDialog = (props: { open: boolean, setOpen: Function }) => {
  const { open, setOpen } = props;
  const navigate = useNavigate();

  const handleEndSession = () => {
    navigate('/');
  };
  
  const handleCancelDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancelDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Close chat session?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to close the chat session? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleEndSession} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionEndDialog;
