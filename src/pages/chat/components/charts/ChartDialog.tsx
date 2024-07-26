import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import LineChart from "./LineChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

interface ChartDialogProps {
  open: boolean;
  onClose: () => void;
  data: Array<{ [key: string]: any }>;
  chartType: string;
}

const ChartDialog: React.FC<ChartDialogProps> = (props) => {
  const { open, onClose, data, chartType } = props;
  console.log("tableData in ChartDialog:", data);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          height: "80vh", // or any other size
        },
      }}
    >
      <DialogTitle>
        {chartType.charAt(0).toUpperCase() + chartType.slice(1) + " Chart"}
      </DialogTitle>
      <DialogContent>
        {chartType === "line" && <LineChart data={data} />}
        {chartType === "bar" && <BarChart data={data} />}
        {chartType === "pie" && <PieChart data={data} />}
      </DialogContent>
    </Dialog>
  );
};

export default ChartDialog;
