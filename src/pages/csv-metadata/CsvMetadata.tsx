import { useAuth0 } from '@auth0/auth0-react';
import { Grid } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import ErrorDialog from '../../components/ErrorDialog';
import PageTitle from '../../components/PageTitle';
import { updateDDL, uploadCsv } from '../../services/csv-service';
import { METADATA_PAGE_SUBTITLE, METADATA_PAGE_TITLE } from '../home/config/CONSTANTS';
import CsvColumnsMetadataButtonsPanel from './components/CsvMetadataButtonsPanel';
import CsvMetadataGrid from './components/CsvMetadataGrid';
import PageSubtitle from '../../components/PageSubtitle';

export default function CsvMetadata() {
  const [buttonVariantOutline, setButtonVariantOutline] 
    = useState<any>("outlined");
  const [buttonLabel, setButtonLabel] = useState<string>("Next");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogError, setDialogError] = useState<any>(null);

  const { state } = useLocation();
  const { file, metadata } = state;
  const [tableData, setTableData] = useState<any>(metadata.table);

  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const MetadataPageTitle = () => {
    return <PageTitle title={METADATA_PAGE_TITLE} />;
  };

  const MetadataPageSubtitle = () => {
    return (
      <PageSubtitle subtitle={METADATA_PAGE_SUBTITLE} />
    );
  };

  async function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log("handleButtonClick: buttonLabel: ", buttonLabel);
    setButtonDisabled(true);
    setButtonLabel("Loading...");
    if (buttonLabel === "Update") {
      console.log("handleButtonClick: Update button clicked");
      try {
        const accessToken = await getAccessTokenSilently();
        const newTableData = await updateDDL(tableData, accessToken);
        setTableData(newTableData);
        setButtonLabel("Next");
        setButtonVariantOutline("contained");
        setButtonDisabled(false);
      } catch (err) {
        console.error("handleButtonClick: Error while updating DDL: ", err);
        setDialogError(err);
        setOpenDialog(true);
      }
    } else {
      console.log("handleButtonClick: Next button clicked");
      try {
        setButtonVariantOutline("contained");
        console.log("handleButtonClick: Table metadata: ", tableData);
        const accessToken = await getAccessTokenSilently();
        const schema = await uploadCsv(file, tableData, accessToken);
        console.log("handleButtonClick: next button click result: ", schema);
        navigate('/chat', { state: { schema } });
      } catch (err) {
        console.error("handleButtonClick: Error while uploading CSV: ", err);
        setDialogError(err);
        setOpenDialog(true);
      }
    }
  }

  async function handleBackButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log("handleBackButtonClick: Back button clicked.");
    navigate(-1);
  }

  return(
    <Layout>
    <div>
      <Grid container spacing={2}>
        <MetadataPageTitle />
        <Grid container>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} sx={{my: 1}}>
            <MetadataPageSubtitle />
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        { openDialog && (<ErrorDialog 
          open={openDialog} 
          title={'Unable to upload CSV'} 
          error={dialogError}
          setOpenDialog={setOpenDialog}
        />)}
        <CsvMetadataGrid 
          tableData={tableData}
          setTableData={setTableData}
          setButtonLabel={setButtonLabel}
          setButtonVariantOutline={setButtonVariantOutline}
          setButtonDisabled={setButtonDisabled}
        />
        <CsvColumnsMetadataButtonsPanel 
          buttonLabel={buttonLabel}
          buttonVariantOutline={buttonVariantOutline}
          buttonDisabled={buttonDisabled}
          handleButtonClick={handleButtonClick}
          handleBackButtonClick={handleBackButtonClick}
        />
      </Grid>
    </div>
    </Layout>
  );
}
