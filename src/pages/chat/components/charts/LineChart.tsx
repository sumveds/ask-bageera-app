import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";

const formatHeader = (header: string) => {
  const formattedHeader = header.replace(/_/g, " ");
  return formattedHeader.charAt(0).toUpperCase() + formattedHeader.slice(1);
};

const backgroundColors = [
  "#E9EDC9",
  "#FAEDCD",
  "#DBE4C6",
  "#E4DCCF",
  "#DDF7E3",
  "#EDF1D6",
];
const borderColors = [
  red[400],
  blue[500],
  yellow[500],
  grey[700],
  green[500],
  orange[400],
];

interface LineChartProps {
  data: { [key: string]: any }[];
}

const LineChart: React.FC<LineChartProps> = (props) => {
  const { data } = props;
  console.log("data in LineChart:", data);
  const keys = Object.keys(data[0]);

  console.log("keys in LineChart:", keys);

  const [xKey, setXKey] = useState(keys[0]);
  const [yKeys, setYKeys] = useState([keys[1]]);

  // Calculate max value in datasets
  const maxDatasetValue = Math.max(
    ...yKeys.flatMap((key) => data.map((item) => item[key]))
  );
  // Increase max value by 20%
  const suggestedMax = maxDatasetValue * 1.1;

  const chartData = {
    labels: data.map((item) => item[xKey]),
    datasets: yKeys.map((key, i) => ({
      label: formatHeader(key),
      data: data.map((item) => item[key]),
      borderWidth: 2,
      fill: false,
      backgroundColor: backgroundColors[i % backgroundColors.length],
      borderColor: borderColors[i % borderColors.length],
    })),
  };

  const options: any = {
    plugins: {
      datalabels: {
        display: function(context: any) {
          return context.dataset.data[context.dataIndex] !== 0; // display labels with non-zero values
        },
        color: blue[700],
        anchor: "end",
        align: "top",
        formatter: (value: any) => {
          return new Intl.NumberFormat("en-IN", {
            minimumIntegerDigits: 1,
            useGrouping: true,
          }).format(value);
        },
        font: {
          weight: "bold",
          size: 12,
        },
      },
    },
    layout: {
      padding: {
        left: 40,
        right: 40,
        top: 0,
        bottom: 0,
      },
    },
    scales: {
      y: {
        suggestedMax: suggestedMax,
      },
    },
    maintainAspectRatio: false,
    // Other options if you need
  };

  return (
    <div style={{ width: "100%", height: "80%" }}>
      <Box mb={3}>
        <FormControl variant="standard" style={{ marginRight: "10px" }}>
          <InputLabel id="x-select-label">X-Axis</InputLabel>
          <Select
            labelId="x-select-label"
            value={xKey}
            onChange={(e) => setXKey(e.target.value)}
          >
            {keys.map((key) => (
              <MenuItem key={key} value={key}>
                {formatHeader(key)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard">
          <InputLabel id="y-select-label">Y-Axis</InputLabel>
          <Select
            labelId="y-select-label"
            multiple
            value={yKeys}
            onChange={(e) => {
              const selectedKeys = e.target.value as string[];
              if (selectedKeys.length > 0) {
                setYKeys(selectedKeys);
              }
            }}
          >
            {keys.map((key) => (
              <MenuItem key={key} value={key}>
                {formatHeader(key)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
