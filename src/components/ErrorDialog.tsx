import * as React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';

interface ErrorDialogProps {
  open: boolean;
  title: string;
  error: { message: string };
  setOpenDialog: Function;
}

export default function ErrorDialog(
  { open, title, error, setOpenDialog }: ErrorDialogProps
) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Error message: {error.message} 
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            You can reach out to our <a href="mailto:support@bageera.io">Support Team</a>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
