import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

type ViewTableNameDialogProps = {
  open: boolean;
  onClose: () => void;
  onProceed: (viewName: string) => void;
};

const ViewTableNameDialog: React.FC<ViewTableNameDialogProps> = ({
  open,
  onClose,
  onProceed,
}) => {
  const [viewName, setViewName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleViewNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newViewName = event.target.value;
    if (newViewName.length > 120) {
      setError("View name cannot exceed 120 characters");
    } else if (!/^[^\s]+$/.test(newViewName)) {
      setError("View name must be a single word");
    } else {
      setError(null);
    }
    setViewName(newViewName);
  };

  const handleProceed = async () => {
    onProceed(viewName);
  };

  const handleCancel = () => {
    setViewName("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth>
      <DialogTitle>Enter View Table Name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="View Name"
          type="text"
          fullWidth
          value={viewName}
          onChange={handleViewNameChange}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button disabled={!viewName || !!error} onClick={handleProceed}>
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTableNameDialog;
