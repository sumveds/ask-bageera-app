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

type View = {
  config: { id: number };
  name: string;
  alias: string;
  warehouse: string;
  database: string;
  query: string;
};

const getViews = async (accessToken: string) => {
  try {
    const response = await axios.get(REACT_APP_API_HOSTNAME + "views", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(
      "getViews: Api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("getViews: Error:", err);
    throwError(err);
  }
};

const createView = async (accessToken: string, view: View) => {
  try {
    const response = await axios.post(REACT_APP_API_HOSTNAME + "views", view, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(
      "createView: Api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("createView: Error:", err);
    throwError(err);
  }
};

export { getViews, createView };
