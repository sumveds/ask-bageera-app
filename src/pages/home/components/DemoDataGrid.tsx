import * as React from 'react';
import { DataGrid } from "@mui/x-data-grid";
import * as Papa from 'papaparse';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { SAMPLE_CSV_FILE } from '../config/CONSTANTS';

export default function DemoDataGrid(
  props: { openSampleData: boolean, closeSampleData: () => void },
) {

  const csvUrl = SAMPLE_CSV_FILE;
  const title = csvUrl.split('.')[0].split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const { openSampleData, closeSampleData } = props;

  const [rows, setRows] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(csvUrl);
      // @ts-ignore
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value);
      const { data } = Papa.parse(csv, { header: true });
      // console.log('data: ', JSON.stringify(data, null, 2));
      // @ts-ignore
      setRows(data.map((row, index) => ({ id: index, ...row })));
    };
    fetchData();
  }, [csvUrl]);

  const columns = rows.length > 0 ? Object.keys(rows[0]).map((key, index) => (
    index === 0 ? {
      field: key,
      headerName: key,
      flex: 1,
      maxWidth: 200,
      hideable: true,
    } : {
      field: key,
      headerName: key,
      flex: 1,
      maxWidth: 200,
      hideable: false,
    }
  )) : [];
  // console.log('columns: ', JSON.stringify(columns, null, 2));

  return (
    <Dialog open={openSampleData} onClose={closeSampleData} fullWidth maxWidth="md">
      <DialogTitle>{title} Data</DialogTitle>
      <DialogContent>
        <DataGrid
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
            columns: {
              columnVisibilityModel: {
                id: false,
              },
            },
          }}
          rows={rows}
          getRowId={(row) => row.id}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </DialogContent>
    </Dialog>
  );
}
