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

const getChatHistory = async (accessToken: string, viewId: number) => {
  try {
    const response = await axios.get(REACT_APP_API_HOSTNAME + "chat/history", {
      params: { viewId },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("getChatHistory: API response:", response.data);
    return response.data;
  } catch (err) {
    console.log("getChatHistory: Error:", err);
    throwError(err);
  }
};

const askQuestion = async (
  view: any,
  question: string,
  accessToken: string
) => {
  try {
    const requestBody = { query: question, view };
    console.log("askQuestion: Chat request: ", requestBody);
    const response = await axios.post(
      REACT_APP_API_HOSTNAME + "chat/",
      requestBody,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // console.log('Ask sql query: ', response.data.query);
    console.log(
      "askQuestion: Chat api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("askQuestion: Error:", err);
    throwError(err);
  }
};

export { getChatHistory, askQuestion };
