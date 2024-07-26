import * as React from 'react';
import { Grid, Box, Button } from '@mui/material';

export default function CsvColumnsMetadataButtonsPanel(
  props: { 
    buttonLabel: string, 
    buttonVariantOutline: any, 
    buttonDisabled: boolean,
    handleButtonClick: Function,
    handleBackButtonClick: Function,
  }
) {
  const { 
    buttonLabel, 
    buttonVariantOutline, 
    buttonDisabled, 
    handleButtonClick, 
    handleBackButtonClick 
  } = props;

  return (
    <Grid container>
      <Grid item xs={2}></Grid>
      <Grid item xs={8} sx={{my: 2}}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button 
            variant="outlined" color="error"
            onClick={(event) => handleBackButtonClick(event)}
          >
            Back
          </Button>
          <Button
            variant={buttonVariantOutline}
            // disabled={loading}
            disabled={buttonDisabled}
            onClick={(event) => handleButtonClick(event)}
          >
            {buttonLabel}
          </Button>
        </Box>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
}