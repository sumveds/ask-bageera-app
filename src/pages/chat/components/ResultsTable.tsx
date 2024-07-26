import React, { useState } from 'react';

import {
  Table, TableBody, TableCell, 
  TableContainer, TableHead, TablePagination, TableRow,
} from '@mui/material';

import { blue } from '@mui/material/colors';

const formatHeader = (header: string) => {
  const formattedHeader = header.replace(/_/g, ' ');
  return formattedHeader.charAt(0).toUpperCase() + formattedHeader.slice(1);
};

const cellValue = (value: any) => {
  const stringifiedValue = JSON.stringify(value);
  if (stringifiedValue.startsWith('"') && stringifiedValue.endsWith('"')) {
    return stringifiedValue.slice(1, -1);
  }
  return stringifiedValue;
};

const ResultsTable = (props: { tableData: Array<{ [key: string]: any }> }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { tableData } = props;
  return (
    <TableContainer
      sx={{
        maxWidth: '90%',
        padding: '0.5rem',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {tableData.length > 0 &&
              Object.keys(tableData[0]).map((header, headerIndex) => (
                <TableCell
                  key={headerIndex}
                  style={{
                    fontWeight: 'bold',
                    backgroundColor: blue[50], // Change this to the desired background color
                  }}
                >
                  {formatHeader(header)}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, rowIndex: number) => (
            <TableRow key={rowIndex}>
              {Object.entries(row).map(([key, value], cellIndex) => {
                return (
                  <TableCell key={cellIndex}>
                    {cellValue(value)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => {
          setPage(newPage);
        }}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </TableContainer>
  );
}

export default ResultsTable;
