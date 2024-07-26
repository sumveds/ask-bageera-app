import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, Button, Grid } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

import TableCard from "./TableCard";
import Layout from "../../../components/Layout";
import Spinner from "../../../components/Spinner";
import { generateViewTableCreateQuery } from "../../../services/big-query-service";

const TablesGrid = () => {
  const { state } = useLocation();
  const { config, dataset, tables } = state;
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [primaryTable, setPrimaryTable] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  const handleCheckboxChange = (tableId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedTables((prevSelected) => [...prevSelected, tableId]);
    } else {
      setSelectedTables((prevSelected) =>
        prevSelected.filter((name) => name !== tableId)
      );
    }
  };

  const generateViewQuery = async () => {
    try {
      setIsLoading(true);
      console.log("generateViewQuery: Selected tables: ", selectedTables);
      const accessToken = await getAccessTokenSilently();
      const query = await generateViewTableCreateQuery(
        accessToken,
        config.id,
        dataset.id,
        selectedTables,
        primaryTable
      );
      console.log("generateViewQuery: Denormalized view table query: ", query);
      navigate("/bigquery/view", {
        state: {
          config: { id: config.id },
          dataset: { id: dataset.id },
          query,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedTables([]);
      setIsLoading(false);
      setPrimaryTable(null);
    }
  };

  const handleButtonClick = async () => {
    if (!primaryTable) {
      setOpenDialog(true);
      return;
    }
    await generateViewQuery();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogProceed = async () => {
    setOpenDialog(false);
    await generateViewQuery();
  };

  return (
    <Layout>
      <Box
        sx={{
          padding: "20px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <Box>
            <Grid container spacing={4} paddingLeft={2} paddingRight={2}>
              {tables.map((table: string, index: number) => (
                <Grid item xs={4} key={index}>
                  <TableCard
                    config={config}
                    dataset={dataset}
                    tableId={table}
                    onCheckboxChange={handleCheckboxChange}
                    isPrimary={primaryTable === table}
                    onPrimaryChange={setPrimaryTable}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                position: "fixed",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={selectedTables.length === 0}
                sx={{ height: "50px" }}
                onClick={handleButtonClick}
              >
                GENERATE LOGICAL VIEW QUERY
              </Button>
            </Box>
            <Dialog
              open={openDialog}
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"No Primary Table Selected"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  You have not selected a primary table. Do you want to proceed?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button onClick={handleDialogProceed} color="primary" autoFocus>
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default TablesGrid;
