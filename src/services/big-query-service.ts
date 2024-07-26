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

type Config = {
  projectId: string;
  file: File;
};

const saveConfig = async (accessToken: string, config: Config) => {
  const { projectId, file } = config;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("projectId", projectId);
  const apiUrl = REACT_APP_API_HOSTNAME + "big-query/config";
  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(
      "saveConfig: Api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("saveConfig: Error:", err);
    throwError(err);
  }
};

const getConfigs = async (accessToken: string) => {
  const apiUrl = REACT_APP_API_HOSTNAME + "big-query/config";
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(
      "getConfig: Api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("getConfig: Error:", err);
    throwError(err);
  }
};

const getDatasets = async (accessToken: string, configId: number) => {
  try {
    const response = await axios.get(
      REACT_APP_API_HOSTNAME + "big-query/datasets",
      {
        params: {
          configId,
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(
      "getDatasets: Api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("getDatasets: Error:", err);
    throwError(err);
  }
};

const getTables = async (
  accessToken: string,
  configId: number,
  datasetId: string
) => {
  try {
    const response = await axios.get(
      REACT_APP_API_HOSTNAME + "big-query/datasets/" + datasetId + "/tables",
      {
        params: {
          configId,
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(
      "getTables: Api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("getTables: Error:", err);
    throwError(err);
  }
};

const getTablesSchemas = async (
  accessToken: string,
  configId: number,
  datasetId: string,
  tableNames: string[]
) => {
  try {
    const response = await axios.post(
      REACT_APP_API_HOSTNAME + "big-query/datasets/" + datasetId + "/schemas",
      tableNames,
      {
        params: {
          configId,
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(
      "getTablesSchemas: Api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("getTablesSchemas: Error:", err);
    throwError(err);
  }
};

const generateViewTableCreateQuery = async (
  accessToken: string,
  configId: number,
  datasetId: string,
  tableIds: string[],
  leftTableId?: string | null
) => {
  try {
    const API_URL =
      REACT_APP_API_HOSTNAME +
      "big-query/datasets/" +
      datasetId +
      "/generate-denormalized-schema";
    console.log("generateViewTableCreateQuery: tableIds: ", tableIds);
    console.log("generateViewTableCreateQuery: datasetId: ", datasetId);
    const response = await axios.post(
      API_URL,
      { leftTableId, tableIds },
      {
        params: {
          configId,
        },
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("generateNormalizedSchema: Api response: ", response.data);
    return response.data;
  } catch (err) {
    console.log("generateNormalizedSchema: Error:", err);
    throwError(err);
  }
};

export {
  saveConfig,
  getConfigs,
  getDatasets,
  getTables,
  getTablesSchemas,
  generateViewTableCreateQuery,
};
