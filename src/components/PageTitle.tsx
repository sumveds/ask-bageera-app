import * as React from "react";
import { Typography, Grid } from "@mui/material";

interface PageTitleProps {
  title: string;
}

const PageTitle = ({ title }: PageTitleProps) => {
  return (
    <Grid container sx={{ marginTop: "20px" }}>
      <Grid item xs={2}></Grid>
      <Grid item xs={8} sx={{ my: 2 }}>
        <Typography fontFamily="Open Sans" variant="h3" align="center">
          {title}
        </Typography>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
  );
};

export default PageTitle;
