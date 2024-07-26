import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "./components/Spinner";
import { validateUser } from "./services/user-service";
import BigQuery from "./pages/big-query/BigQuery";
import Connectors from "./pages/connectors/Connectors";
import TablesGrid from "./pages/big-query/components/TablesGrid";
import ViewQueryComponent from "./pages/big-query/components/ViewQuery";
import Main from "./Main";
import Chat from "./pages/chat/Chat";

function App() {
  const {
    isLoading,
    isAuthenticated,
    error,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const user = await validateUser(accessToken);
        console.log("Validated user: ", user);
      } catch (error) {
        console.error("Error while validating user: ", error);
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Main />} />
        <Route path="/connectors" element={<Connectors />} />
        <Route path="/bigquery/datasets" element={<BigQuery />} />
        <Route path="/bigquery/tables" element={<TablesGrid />} />
        <Route path="/bigquery/view" element={<ViewQueryComponent />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
