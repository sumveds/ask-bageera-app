import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { blue, green, grey, orange, red, yellow } from '@mui/material/colors';

const formatHeader = (header: string) => {
  const formattedHeader = header.replace(/_/g, ' ');
  return formattedHeader.charAt(0).toUpperCase() + formattedHeader.slice(1);
};

const backgroundColors = [red[400], blue[500], yellow[500], grey[700], green[500], orange[400]];

interface PieChartProps {
  data: { [key: string]: any }[];
}

const PieChart: React.FC<PieChartProps> = (props) => {
  const { data } = props;
  const keys = Object.keys(data[0]);

  const [key, setKey] = useState(keys[1]);

  const values = data.map((item) => Number(item[key]));

  const chartData = {
    labels: data.map((item) => item[keys[0]]),
    datasets: [{
      data: values,
      backgroundColor: backgroundColors,
    }],
  };

  const options: any = {
    plugins: {
      datalabels: {
        color: 'black',
        font: {
          weight: 'bold',
          size: 12,
        },
        formatter: (value: any, ctx: any) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data: any) => {
            sum += Number(data);
          });
          let percentage = ((Number(value) * 100) / sum).toFixed(2) + "%";
          return percentage;
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', height: '80%' }}>
      <Box mb={3}>
        <FormControl variant="standard">
          <InputLabel id="select-label">Select</InputLabel>
          <Select
            labelId="select-label"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          >
            {keys.map((key) => (
              <MenuItem key={key} value={key}>
                {formatHeader(key)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
