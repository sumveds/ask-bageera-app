import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";

import Layout from "../../components/Layout";
import PageTitle from "../../components/PageTitle";
import PageSubtitle from "../../components/PageSubtitle";
import { HOME_PAGE_SUBTITLE, HOME_PAGE_TITLE } from "../home/config/CONSTANTS";
import BigQueryIcon from "./components/BigQueryIcon";
import BigQueryConfigDialog from "./components/BigQueryConfigDialog";

const Connectors = () => {
  const navigate = useNavigate();
  const [openConfigDialog, setOpenConfigDialog] = useState<boolean>(false);

  const ConnectDataSourceTitle = () => {
    return <PageTitle title={HOME_PAGE_TITLE} />;
  };

  const ConnectDataSourceSubtitle = () => {
    return <PageSubtitle subtitle={HOME_PAGE_SUBTITLE} />;
  };

  const handleIconClick = () => {
    setOpenConfigDialog(true);
  };

  const showDatabases = (config: any) => {
    setOpenConfigDialog(false);
    console.log("Connectors: showDatabases: Config object:", config);
    navigate("/bigquery/datasets", { state: { config } });
  };

  const closeConfigDialog = () => {
    setOpenConfigDialog(false);
  };

  return (
    <Layout>
      <div>
        <Grid container spacing={2}>
          <ConnectDataSourceTitle />
          {/* <ConnectDataSourceSubtitle /> */}
          {openConfigDialog && (
            <BigQueryConfigDialog
              open={openConfigDialog}
              onClose={showDatabases}
              onCancel={closeConfigDialog}
            />
          )}
          <Grid sx={{ mt: 2 }} container spacing={2}>
            <Grid item xs={3}></Grid>
            <Grid item xs={6} sx={{ my: 8 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <BigQueryIcon onClick={handleIconClick} />
              </Box>
            </Grid>
            <Grid item xs={3}></Grid>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Connectors;
