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

const validateUser = async (accessToken: string) => {
  try {
    const response = await axios.post(
      REACT_APP_API_HOSTNAME + "user/validate",
      undefined,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(
      "validateUser: Api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("validateUser: Error:", err);
    throwError(err);
  }
};

const updateUser = async (accessToken: string, user: any) => {
  try {
    console.log("updateUser: user:", user);
    const response = await axios.put(
      REACT_APP_API_HOSTNAME + "user/" + user.id,
      user,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(
      "updateUser: Api response: ",
      JSON.stringify(response.data, null, 2)
    );
    return response.data;
  } catch (err) {
    console.log("updateUser: Error:", err);
    throwError(err);
  }
};

export { validateUser, updateUser };
