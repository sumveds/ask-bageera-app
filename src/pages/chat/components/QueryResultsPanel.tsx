import React, { useState } from "react";
import { Box, IconButton, Snackbar, SnackbarCloseReason } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import Papa from "papaparse";

import Chart from "chart.js/auto";
import { LineController, LinearScale, CategoryScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import ResultsTable from "./ResultsTable";
import ChartDialog from "./charts/ChartDialog";
import { blue, green, orange, red } from "@mui/material/colors";

Chart.register(LineController, LinearScale, CategoryScale, ChartDataLabels);

interface QueryResultsPanelProps {
  tableData?: Array<{ [key: string]: any }>;
}

const QueryResultsPanel: React.FC<QueryResultsPanelProps> = ({ tableData }) => {
  console.log("tableData:", tableData);
  if (!tableData) {
    return null; // Render nothing if tableData is undefined
  }
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chartType, setChartType] = useState("");

  const handleClickOpen = (type: string) => {
    setChartType(type);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const copyTableData = async () => {
    try {
      const csv = Papa.unparse(tableData);
      await navigator.clipboard.writeText(csv);
      setSnackbarMessage("Data copied to clipboard!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to copy data!");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const getTableDataKeysLength = (tableData: Array<any>) => {
    if (tableData.length === 0) {
      return 0;
    }
    return Object.keys(tableData).length;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ResultsTable tableData={tableData} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: "1rem",
        }}
      >
        <IconButton
          style={{ color: blue[500] }}
          aria-label="copy"
          onClick={copyTableData}
        >
          <ContentCopyIcon />
        </IconButton>
        <IconButton
          style={{
            color: getTableDataKeysLength(tableData) <= 1 ? red[100] : red[500],
          }}
          aria-label="line-chart"
          onClick={() => handleClickOpen("line")}
          disabled={getTableDataKeysLength(tableData) <= 1}
        >
          <ShowChartIcon />
        </IconButton>
        <IconButton
          style={{
            color:
              getTableDataKeysLength(tableData) <= 1 ? green[100] : green[500],
          }}
          aria-label="bar-chart"
          onClick={() => handleClickOpen("bar")}
          disabled={getTableDataKeysLength(tableData) <= 1}
        >
          <BarChartIcon />
        </IconButton>
        <IconButton
          style={{
            color:
              getTableDataKeysLength(tableData) <= 1
                ? orange[100]
                : orange[400],
          }}
          aria-label="pie-chart"
          onClick={() => handleClickOpen("pie")}
          disabled={getTableDataKeysLength(tableData) <= 1}
        >
          <PieChartIcon />
        </IconButton>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      <ChartDialog
        open={dialogOpen}
        onClose={handleClose}
        data={tableData}
        chartType={chartType}
      />
    </Box>
  );
};

export default QueryResultsPanel;
