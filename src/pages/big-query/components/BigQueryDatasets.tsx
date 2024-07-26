import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { amber, grey } from "@mui/material/colors";

import { useAuth0 } from "@auth0/auth0-react";

import "../styles/BigQuery.css";

import { getTables } from "../../../services/big-query-service";
import Spinner from "../../../components/Spinner";
import { useNavigate } from "react-router-dom";

interface Column {
  id: "name";
  label: string;
  minWidth?: number;
  align?: "right";
}

const columns: readonly Column[] = [
  { id: "name", label: "Dataset", minWidth: 170 },
];

// Define the props
type BigQueryDatasetsProps = {
  config: {
    id: number;
    datasets: string[];
  };
};

const BigQueryDatasets: React.FC<BigQueryDatasetsProps> = ({ config }) => {
  console.log("BigQueryDatasets: Config:", config);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const { getAccessTokenSilently } = useAuth0();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = async (datasetId: string) => {
    try {
      setLoading(true);
      console.log("Clicked on: ", datasetId);
      const accessToken = await getAccessTokenSilently();
      const tables = await getTables(accessToken, config.id, datasetId);
      console.log("BigQueryDatasets: handleClick: Tables: ", tables);
      console.log("BigQueryDatasets: handleClick: Dataset id: ", datasetId);
      navigate("/bigquery/tables", {
        state: {
          config: { id: config.id },
          dataset: { id: datasetId },
          tables,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <Paper
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 1,
            width: "30%",
            boxShadow: 3,
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            fontSize: 14,
            fontFamily: "Open Sans",
            "& .super-app-theme--header": {
              backgroundColor: grey[300],
              fontSize: 16,
              border: 1.0,
              borderColor: grey[600],
            },
            "& .super-app-theme--cell": {
              backgroundColor: amber[50],
            },
          }}
        >
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{ fontWeight: "bold", backgroundColor: grey[300] }} // Added here
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {config.datasets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((dataset) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={dataset}
                        onClick={() => handleClick(dataset)}
                      >
                        {columns.map((column) => {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {dataset}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={config.datasets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  );
};

export default BigQueryDatasets;
