import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type TableInfoProps = {
  open: boolean;
  onClose: () => void;
  tableData: {
    id: string;
    fields: {
      name: string;
      type: string;
    }[];
  };
};

const TableInfo: React.FC<TableInfoProps> = ({ open, onClose, tableData }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {tableData.id.split(".")[1]}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Column Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Column Type
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.fields.map((field, index) => (
                <TableRow key={index}>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{field.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default TableInfo;
