import axios, { AxiosError } from "axios";

const REACT_APP_API_HOSTNAME = process.env.REACT_APP_API_HOSTNAME;

const throwError = (err: unknown) => {
  const error = err as Error | AxiosError;
  let message;
  if (axios.isAxiosError(error)) {
    // @ts-ignore
    message = error.response.data.message;
  } else {
    message = error.message;
  }
  throw new Error(message);
};

const generateDDL = async (file: File, accessToken: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    console.log("generateDDL: process.env:", process.env);
    const response = await axios.post(
      REACT_APP_API_HOSTNAME + "csv/generate-metadata",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.log("uploadCsv: Error:", err);
    throwError(err);
  }
};

const updateDDL = async (metadata: any, accessToken: string) => {
  console.log("updateDDL: metadata:", metadata);
  try {
    const response = await axios.post(
      REACT_APP_API_HOSTNAME + "csv/update-metadata",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("updateDDL: Http response:", response.data);
    return response.data;
  } catch (err) {
    console.log("updateDDL: Error:", err);
    throwError(err);
  }
};

const uploadCsv = async (file: File, metadata: string, accessToken: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("table", JSON.stringify(metadata));
    const response = await axios.post(
      REACT_APP_API_HOSTNAME + "csv/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("uploadCsv: Http response:", response.data);
    return response.data;
  } catch (err) {
    console.log("uploadCsv: Error:", err);
    throwError(err);
  }
};

export { generateDDL, updateDDL, uploadCsv };
