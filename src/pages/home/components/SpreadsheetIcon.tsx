import { Button } from '@mui/material';
import React, {useCallback,useState} from 'react';
import SpreadsheetSvg from '../../../assets/icons/spreadsheet.svg';
import { ButtonStyle } from '../styles/ButtonStyle';
import '../styles/Home.css';
import  useDrivePicker from 'react-google-drive-picker';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';

const REACT_APP_GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const REACT_APP_GOOGLE_DEV_KEY = process.env.REACT_APP_GOOGLE_DEV_KEY || '';

function SpreadsheetIcon({ onCsvFileReady }: { onCsvFileReady: (file: File) => void }) {

  const [openPicker] = useDrivePicker();
  const [accessToken, setAccessToken] = useState<string | null>(null) ;
  const [isSignedIn, setIsSignedIn] = useState(false);

  const fetchSheetData = useCallback(async(fileId:any, accessToken:string) => {
    axios.get(`https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'blob',
    })
    .then(response => {
      const fileName = `spreadsheet-${fileId}.csv`;
      const csvFile = new File([response.data], fileName, { type: 'text/csv' });
      onCsvFileReady(csvFile); // Call the onCsvFileReady function with the File object
    })
    .catch(error => {
      console.log(error);
    });
  }, [onCsvFileReady]);

  const handleOpenPicker = useCallback((accessToken:string) => {
    openPicker({
      clientId: REACT_APP_GOOGLE_CLIENT_ID,
      developerKey: REACT_APP_GOOGLE_DEV_KEY,
      viewId: "SPREADSHEETS",
      token: accessToken,
      multiselect: false,
      customScopes:[
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets.readonly'
      ],
      viewMimeTypes: "application/vnd.google-apps.spreadsheet",
      callbackFunction: (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button');
        } else if (data.action === 'picked') {
          console.log('Selected file ID:', data.docs[0].id);
          const fileId = data.docs[0].id;
          fetchSheetData(fileId, accessToken);
        }
      },
    });
  },[openPicker, accessToken]);


  const handlelogin =  
    useGoogleLogin({
      onSuccess: tokenResponse => {
        console.log(tokenResponse);
        setAccessToken(tokenResponse.access_token);
        setIsSignedIn(true);
        handleOpenPicker(tokenResponse.access_token);
    },
    scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly'
  });
  
  return (
    <div>
      <div className='Icons-Svg Spreadsheet'>
        <Button
          sx={{ boxShadow: 2 }}
          component='label'
          style={ButtonStyle.STYLE}
          variant='contained'
          disableElevation={true}
          onClick={() =>isSignedIn ? handleOpenPicker(accessToken || " ") : handlelogin()}
        >
          <img src={SpreadsheetSvg} width={80} height={80} />
        </Button>
      </div>
      <div className='Icons-Label'>
        Google Sheet
      </div>
    </div>
  );
};

export default SpreadsheetIcon;
