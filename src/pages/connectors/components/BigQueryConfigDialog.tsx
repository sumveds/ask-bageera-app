import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

import {
  saveConfig,
  getConfigs,
  getDatasets,
} from "../../../services/big-query-service";
import Spinner from "../../../components/Spinner";

type BigQueryConfigProps = {
  open: boolean;
  onClose: (config: any) => void;
  onCancel: () => void;
};

const BigQueryConfigDialog: React.FC<BigQueryConfigProps> = ({
  open,
  onClose,
  onCancel,
}) => {
  const [projectId, setProjectId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [configs, setConfigs] = useState<any[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const handleProjectIdChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newProjectId = event.target.value;
    if (newProjectId.length > 120) {
      setError("Project ID cannot exceed 120 characters");
    } else if (!/^[^\s]+$/.test(newProjectId)) {
      setError("Project ID must be a single word");
    } else {
      setError(null);
    }
    setProjectId(newProjectId);
  };

  const fetchConfigs = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await getConfigs(accessToken);
      console.log("fetchConfigs: Response: ", response);
      setConfigs(response);
    } catch (error) {
      console.error("fetchConfigs: Error fetching configs:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchConfigs();
      setSelectedConfig("");
    }
  }, [open]);

  const handleError = (error: any) => {
    if (error instanceof Error) {
      setSnackbarMessage(error.message);
    } else {
      setSnackbarMessage("An unexpected error occurred");
    }
    setSnackbarOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
    event.target.value = "";
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleSave = async () => {
    console.log("handleSave: Selected config: ", selectedConfig);
    const accessToken = await getAccessTokenSilently();
    if (selectedConfig === "new" && file && projectId) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);
      try {
        const response = await saveConfig(accessToken, { projectId, file });
        console.log("handleSave: Response: ", response);
        onClose(response);
      } catch (error) {
        console.error("handleSave: Error uploading file:", error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    } else if (selectedConfig !== "new" && selectedConfig !== "") {
      setLoading(true);
      const selectedConfigData = configs.find(
        (config) => config.projectId === selectedConfig
      );
      try {
        const datasets = await getDatasets(accessToken, selectedConfigData.id);
        console.log("handleSave: Datasets: ", datasets);
        selectedConfigData.datasets = datasets;
        onClose(selectedConfigData);
      } catch (error) {
        console.error("handleSave: Error uploading file:", error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth>
      <DialogTitle>Select OR Create BigQuery Configuration</DialogTitle>
      <DialogContent>
        <Select
          value={selectedConfig}
          onChange={(event) => setSelectedConfig(event.target.value as string)}
          displayEmpty
          fullWidth
          sx={{ marginTop: "15px" }}
          disabled={loading}
        >
          <MenuItem value="">Select Config</MenuItem>
          {configs &&
            configs.map((config) => (
              <MenuItem key={config.projectId} value={config.projectId}>
                {config.projectId}
              </MenuItem>
            ))}
          <MenuItem value="new">Create New</MenuItem>
        </Select>
        {selectedConfig === "new" && (
          <>
            <TextField
              error={!!error}
              helperText={error}
              autoFocus
              margin="dense"
              id="projectId"
              label="Project ID"
              type="text"
              fullWidth
              sx={{ marginTop: "24px" }}
              value={projectId}
              onChange={handleProjectIdChange}
            />
            <FormControl style={{ marginTop: "15px" }} disabled={loading}>
              <input
                style={{ display: "none" }}
                accept=".json"
                id="upload-button"
                type="file"
                onChange={handleFileChange}
                disabled={loading}
              />
              <Box display="flex" alignItems="center">
                <label htmlFor="upload-button">
                  <Button variant="contained" component="span">
                    Upload
                  </Button>
                </label>
                {file && (
                  <Typography
                    variant="subtitle1"
                    style={{ marginLeft: "10px" }}
                  >
                    {file.name}
                  </Typography>
                )}
              </Box>
            </FormControl>
          </>
        )}
        {loading && <Spinner />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={
            loading ||
            selectedConfig === "" ||
            (selectedConfig === "new" &&
              (!file || !projectId || Boolean(error)))
          }
        >
          {selectedConfig === "new" ? "Save" : "Proceed"}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default BigQueryConfigDialog;
