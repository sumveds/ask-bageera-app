import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth0 } from '@auth0/auth0-react';
import Layout from '../../components/Layout';
import CsvIcon from './components/CsvIcon';
import DemoIcon from './components/DemoIcon';
import SpreadsheetIcon from './components/SpreadsheetIcon';
import { 
  CSV_FILE_SIZE_LIMIT,
  HOME_PAGE_SUBTITLE,
  HOME_PAGE_TITLE,
  SAMPLE_CSV_FILE
} from './config/CONSTANTS';
import PageTitle from '../../components/PageTitle';
import PageSubtitle from '../../components/PageSubtitle';
import ErrorDialog from '../../components/ErrorDialog';
import { generateDDL } from '../../services/csv-service';
import Spinner from '../../components/Spinner';
import { useNavigate } from 'react-router-dom';
import DemoDataGrid from './components/DemoDataGrid';
import BigQueryIcon from '../connectors/components/BigQueryIcon';
import { getDatasets } from '../../services/big-query-service';

const REACT_APP_GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

export default function Home() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [loading, isLoading] = React.useState<boolean>(false);
  const [showSampleData, setShowSampleData] = useState<boolean>(false);

  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const handleSampleData = () => {
    console.log('handleSampleData: showSampleData: ', showSampleData);
    setShowSampleData(true);
  };

  const closeSampleData = async () => {
    console.log('closeSampleData: showSampleData: ', showSampleData);
    isLoading(true);
    try {
      setShowSampleData(false);
      // const response = await fetch('/quarterly_sales.csv');
      const response = await fetch(SAMPLE_CSV_FILE);
      const blob = await response.blob();
      const file = new File([blob], SAMPLE_CSV_FILE, { type: 'text/csv' });
      const accessToken = await getAccessTokenSilently();
      const metadata = await generateDDL(file, accessToken);
      console.log('closeSampleData: Csv metadata:', metadata);
      isLoading(false);
      navigate('/metadata', { state: { metadata, file }});
    } catch (error) {
      console.error('closeSampleData: Error while generating DDL:', error);
      setError(error);
      setOpenDialog(true);
      isLoading(false);
    }
  };

  const handleCsvChange = async (file: File) => {
    console.log('CSV file selected:', file);
    if (file.size > CSV_FILE_SIZE_LIMIT) {
      console.error(`handleCsvChange: File size exceeded. Allowed is ${CSV_FILE_SIZE_LIMIT} byte.`);
      setError({
        message: `File size exceeded. Allowed is ${CSV_FILE_SIZE_LIMIT} byte.`,
      });
      setOpenDialog(true);
    } else {
      isLoading(true);
      try {
        const accessToken = await getAccessTokenSilently();
        const metadata = await generateDDL(file, accessToken);
        console.log('handleCsvChange: Csv metadata:', metadata);
        isLoading(false);
        navigate('/metadata', { state: { metadata, file }});
      } catch (error) {
        console.error('handleCsvChange: Error while generating DDL:', error);
        setError(error);
        setOpenDialog(true);
        isLoading(false);
      }
    }
  };

  /* const handleBigQueryLogin = async () => {
    isLoading(true);
    const accessToken = await getAccessTokenSilently();
    const datasets = await getDatasets(accessToken);
    isLoading(false);
    navigate('/big-query', { state: { datasets }});
  }; */

  const ConnectDataSourceTitle = () => {
    return <PageTitle title={HOME_PAGE_TITLE} />;
  };
  
  const ConnectDataSourceSubtitle = () => {
    return (
      <PageSubtitle subtitle={HOME_PAGE_SUBTITLE} />
    );
  };
 
  return (
    <Layout>
      <div>
        <Grid container spacing={2}>
          <ConnectDataSourceTitle />
          <ConnectDataSourceSubtitle />
          { showSampleData && (
            <DemoDataGrid
              openSampleData={showSampleData}
              closeSampleData={closeSampleData}
            />)
          }
          { openDialog && (<ErrorDialog 
            open={openDialog} 
            title={'Unable to parse CSV'} 
            error={error}
            setOpenDialog={setOpenDialog}
          />)}
          { loading ? <Spinner /> : 
            <Grid sx={{mt: 2}} container spacing={2}>
              <Grid item xs={3}></Grid>
              <Grid item xs={6} sx={{my: 4}}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <DemoIcon onChange={handleSampleData} />
                  <CsvIcon onChange={handleCsvChange} />
                  <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
                    <SpreadsheetIcon onCsvFileReady={handleCsvChange} />
                  </GoogleOAuthProvider>
                </Box>
              </Grid>
              <Grid item xs={3}></Grid>
              {/* <Grid item xs={3}></Grid>
              <Grid item xs={6} sx={{my: 4}}>
                <Box display="flex" justifyContent="left" alignItems="left">
                  <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
                    <BigQueryIcon onBigQueryReady={handleBigQueryLogin} />
                  </GoogleOAuthProvider>
                </Box>
              </Grid>
              <Grid item xs={3}></Grid> */}
            </Grid>
          }
        </Grid>
      </div>
    </Layout>
  );
}
