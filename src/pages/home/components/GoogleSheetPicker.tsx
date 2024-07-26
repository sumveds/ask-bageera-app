import React, {useState} from 'react';
import axios from 'axios';

declare const navigator: any;

interface SheetData {
  headers: string[];
  rows: { [key: string]: string }[];
}

interface GoogleSheetPickerProps {
  apiKey: string;
  clientId: string;
  scope?: string;
  developerKey?: string;

}

export default class GoogleSheetPicker extends React.Component<GoogleSheetPickerProps> {
  private oauthToken: string | null = null;
  private isGoogleApiLoaded: boolean = false;

  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true; // load asynchronously
    script.defer = true; // defer execution until HTML parser is done
    script.addEventListener('load', () => this.handleClientLoad());
    document.head.appendChild(script);
  }

  
  handleClientLoad = (): void => {
    // Initialize the API client library
    //(window as Window & typeof globalThis & { gapi?: any }).gapi?.load('client:auth2', this.initClient);
    (window.gapi && window.gapi.load('client:auth2', this.initClient));

  };

  initClient = (): void => {
    // Initialize the API client library and setup sign-in listeners
    window.gapi.client
      .init({
        apiKey: this.props.apiKey,
        clientId: this.props.clientId,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: this.props.scope || 'https://www.googleapis.com/auth/drive.file',
      })
      .then(() => {
      // Listen for sign-in state changes
      (window).gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
      // Handle the initial sign-in state
      this.updateSigninStatus((window).gapi.auth2.getAuthInstance().isSignedIn.get());
      this.isGoogleApiLoaded = true;
    }, (error :Error) => {
      console.error('Error initializing Google API:', error);
      alert('There was an error initializing the Google API. Please try again later.');
    });
  };

  updateSigninStatus = (isSignedIn: boolean): void => {
    // Set the OAuth token if the user is signed in
    if (isSignedIn) {
      this.oauthToken =  (window).gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    } else {
      this.oauthToken = null;
    }
  };

  openPicker = (): void => {
    const google = (window as Window & typeof globalThis & { google?: any }).google;
  if (!google) {
    console.error("Google API not loaded");
    return;
  }
  const pickerBuilder = new google.picker.PickerBuilder();
  pickerBuilder.addView(google.picker.ViewId.SPREADSHEETS);
    // Set developer key if provided
    const { developerKey } = this.props;
    if (developerKey) {
      pickerBuilder.setDeveloperKey(developerKey);
    }
    pickerBuilder.setOAuthToken(this.oauthToken);
    pickerBuilder.setCallback(this.pickerCallback);
    const picker = pickerBuilder.build();
    picker.setVisible(true);
  };

  pickerCallback = (data: any): void => {
    if (data.action === (window as any).google.picker.Action.PICKED) {
      const doc = data.docs[0];
      const fileId = doc.id;
      this.fetchSheetData(fileId);
    }
  };

fetchSheetData = async (fileId: string): Promise<void> => {
  const url = `https://docs.google.com/spreadsheets/export?id=${fileId}&exportFormat=csv`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.oauthToken}`,
      },
      responseType: "blob" // set responseType to blob to receive binary data as response
    });
    const blobData = new Blob([response.data], { type: "text/csv" }); // create a blob object with the received data
    const fileName = `${fileId}.csv`; // give a name to your csv file
    if (typeof navigator !== 'undefined' && navigator.msSaveOrOpenBlob) { 
      // If user is using Internet Explorer, download the file directly by creating a link
      navigator.msSaveOrOpenBlob(blobData, fileName);
    } else { // otherwise get object URL from blob object and save it to local storage
      const objectURL = URL.createObjectURL(blobData);
      localStorage.setItem(fileName, objectURL); // store the object URL in local storage
    }
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    alert('There was an error loading data from the spreadsheet. Please try again later.');
  }
};

}

