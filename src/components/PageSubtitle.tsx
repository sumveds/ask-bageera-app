import * as React from 'react';
import { Typography, Grid } from '@mui/material';
import { blue } from '@mui/material/colors';

interface PageSubtitleProps {
  subtitle: string;
}

const PageSubtitle = ({ subtitle }: PageSubtitleProps) => {
  return (
    <Grid container>
      <Grid item xs={2}></Grid>
      <Grid item xs={8} sx={{my: 1}}>
        <Typography fontFamily="Open Sans" fontWeight={600} color={blue['A400']} variant="subtitle1" align="center">
          {subtitle}
        </Typography>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
};

export default PageSubtitle;
