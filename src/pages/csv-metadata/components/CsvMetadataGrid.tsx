import * as React from 'react';
import { Grid } from '@mui/material';
import { 
  DataGrid, GridCellModes, 
  GridCellModesModel, GridCellParams, GridColDef, 
} from "@mui/x-data-grid";
import { amber, grey } from '@mui/material/colors';

export default function CsvMetadataGrid(
  props: {
    tableData: any,
    setTableData: Function,
    setButtonLabel: Function, 
    setButtonVariantOutline: Function, 
    setButtonDisabled: Function,
  },
) {

  const { 
    tableData, setTableData, setButtonLabel, 
    setButtonVariantOutline, setButtonDisabled 
  } = props;

  const [cellModesModel, setCellModesModel] = React.useState<
    GridCellModesModel
  >({});

  const handleCellModesModelChange = React.useCallback((newModel: GridCellModesModel) => {
    setCellModesModel(newModel);
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, hideable: true, },
    {
      field: 'csv_header',
      headerName: 'CSV Header',
      maxWidth: 150,
      flex: 1,
      editable: false,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
    },
    {
      field: 'column_name',
      headerName: 'Column Name',
      maxWidth: 160,
      flex: 1,
      editable: false,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
    },
    {
      field: 'data_type',
      headerName: 'Data Type',
      maxWidth: 150,
      flex: 1,
      editable: false,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return value.toLowerCase().split('(')[0];
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      editable: true,
      // minWidth: 280,
      flex: 1,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      cellClassName: 'super-app-theme--cell',
    },
  ];

  const handleCellClick = React.useCallback((params: GridCellParams) => {
    if (params.field === columns[columns.length - 1].field) {
      setButtonDisabled(true);
      setCellModesModel((prevModel) => ({
        ...prevModel,
        [params.id]: {
          ...prevModel[params.id],
          [params.field]: {
            mode: GridCellModes.Edit,
          },
        },
      }));
    }
  }, [columns]);

  const onRowUpdate = (newRow: any) => {
    const rows = tableData.columns;
    const newRows = [...rows];
    const rowToUpdate = newRows.find(row => row.id === newRow.id);
    if (rowToUpdate.description !== newRow.description) {
      rowToUpdate.description = newRow.description;
      setTableData({ name: tableData.name, columns: newRows });
      console.log('New rows state:', rows);
      setButtonLabel("Update");
      setButtonVariantOutline("contained");
    }
    setButtonDisabled(false);
    return rowToUpdate;
  };

  return (
    <Grid container>
      <Grid item xs={2}></Grid>
      <Grid item xs={8} sx={{my: 4}}>
        <DataGrid
          initialState={{
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
          autoHeight
          columns={columns}
          rows={tableData.columns}
          hideFooter
          cellModesModel={cellModesModel}
          onCellModesModelChange={handleCellModesModelChange}
          onCellClick={handleCellClick}
          processRowUpdate={onRowUpdate}
          sx={{
            boxShadow: 3,
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
            fontSize: 14,
            fontFamily: "Open Sans",
            '& .super-app-theme--header': {
              backgroundColor: grey[300],
              fontSize: 16,
              border: 1.0,
              borderColor: grey[600],
            },
            '& .super-app-theme--cell': {
              backgroundColor: amber[50],
            },
          }}
        />
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
}