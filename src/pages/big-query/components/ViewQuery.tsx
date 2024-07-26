import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";

import { useAuth0 } from "@auth0/auth0-react";

import { format } from "sql-formatter";

import Layout from "../../../components/Layout";
import ViewTableNameDialog from "./ViewTableName";
import { createView } from "../../../services/view-service";
import Spinner from "../../../components/Spinner";

const ViewQueryComponent = () => {
  const { state } = useLocation();
  const { config, dataset, query } = state;

  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(query);
  const [formattedQuery, setFormattedQuery] = React.useState(
    format(inputValue, { language: "mysql" })
  );
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleProceed = async (viewName: string) => {
    setDialogOpen(false);
    setLoading(true);
    try {
      const accessToken = await getAccessTokenSilently();
      const views = await createView(accessToken, {
        config,
        name: viewName,
        alias: viewName,
        database: dataset.id,
        warehouse: "bigquery",
        query: formattedQuery,
      });
      console.log("handleProceed: Views after fetching:", views);
      navigate("/chat", { state: { views } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    try {
      setFormattedQuery(format(event.target.value, { language: "mysql" }));
    } catch (error) {
      // Error handling (optional)
      console.error("Failed to format the SQL query.");
    }
  };

  return (
    <Layout>
      <Grid
        container
        justifyContent="center" // horizontally center the children
        alignItems="center" // vertically center the children
        style={{ minHeight: "85vh" }} // take full height
      >
        {loading ? (
          <Spinner />
        ) : (
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "75vh",
                // padding: "10px",
                width: "100%",
              }}
            >
              <TextField
                multiline
                rows={21}
                value={inputValue}
                onChange={handleChange}
                variant="outlined"
                disabled={loading}
                sx={{
                  width: "100%",
                  flexGrow: 1,
                  overflow: "auto",
                  "& .MuiInputBase-input": {
                    fontSize: "13px",
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{ height: "50px", marginTop: "15px" }}
                disabled={!inputValue || loading}
                onClick={handleOpen}
              >
                CREATE LOGICAL VIEW
              </Button>
              <ViewTableNameDialog
                open={dialogOpen}
                onClose={handleClose}
                onProceed={handleProceed}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Layout>
  );
};

export default ViewQueryComponent;
