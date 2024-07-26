import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { blue, green, grey, orange, red, yellow } from '@mui/material/colors';

const formatHeader = (header: string) => {
  const formattedHeader = header.replace(/_/g, ' ');
  return formattedHeader.charAt(0).toUpperCase() + formattedHeader.slice(1);
};

const backgroundColors = ['#E9EDC9', '#FAEDCD', '#DBE4C6', '#E4DCCF', '#DDF7E3', '#EDF1D6'];
const borderColors = [red[400], blue[500], yellow[500], grey[700], green[500], orange[400]];

interface BarChartProps {
  data: { [key: string]: any }[];
}

const BarChart: React.FC<BarChartProps> = (props) => {
  const { data } = props;
  const keys = Object.keys(data[0]);

  const [xKey, setXKey] = useState(keys[0]);
  const [yKeys, setYKeys] = useState([keys[1]]);

  // Calculate max value in datasets
  const maxDatasetValue = Math.max(...yKeys.flatMap(key => data.map(item => item[key])));
  // Increase max value by 20%
  const suggestedMax = maxDatasetValue * 1.1;

  const chartData = {
    labels: data.map((item) => item[xKey]),
    datasets: yKeys.map((key, i) => ({
      label: formatHeader(key),
      data: data.map((item) => item[key]),
      borderWidth: 2,
      backgroundColor: backgroundColors[i % backgroundColors.length],
      borderColor: borderColors[i % borderColors.length],
    })),
  };

  const options: any = {
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true, suggestedMax: suggestedMax, },
    },
    plugins: {
      datalabels: {
        color: 'black',
        font: {
          weight: 'bold',
          size: 12,
        },
        formatter: function(value: any) {
          return new Intl.NumberFormat('en-IN', { minimumIntegerDigits: 1, useGrouping: true }).format(value);
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '80%' }}>
      <Box mb={3}>
        <FormControl variant="standard" style={{ marginRight: '10px' }}>
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

      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
