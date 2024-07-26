import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { getViews } from "./services/view-service";
import Spinner from "./components/Spinner";

interface View {
  id: number;
  name: string;
}

const Main = () => {
  const [views, setViews] = React.useState<View[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchViews = async () => {
      const token = await getAccessTokenSilently();
      try {
        const views = await getViews(token);
        console.log("Views: ", views);
        setViews(views);
        if (views.length > 0) {
          navigate("/chat", { state: { views } });
        } else {
          navigate("/connectors");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchViews();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return null;
};

export default Main;
