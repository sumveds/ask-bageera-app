import React, { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ChatPanel from "./components/ChatPanel";
import Layout from "../../components/Layout";
import ChatSidebar from "./components/ChatSidebar";
import { View } from "../../types";
import { Box, Button } from "@mui/material";
import { blue, green, grey, red } from "@mui/material/colors";

const Chat = () => {
  const { state } = useLocation();
  const { views } = state;
  const [selectedView, setSelectedView] = useState<View>(views[0]);
  const [showSidebar, setShowSidebar] = useState(true);

  const navigate = useNavigate();

  const handleViewSelect = useCallback((view: View) => {
    setSelectedView(view);
  }, []);

  const handleButtonClick = () => {
    navigate("/connectors");
  };

  return (
    <Layout>
      <Grid container style={{ height: "100%" }}>
        {showSidebar && (
          <Grid
            item
            xs={2}
            style={{
              borderRight: "1px solid #ddd",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              paddingLeft="10px"
              py="10px"
            >
              <Button
                variant="outlined"
                sx={{
                  height: "40px",
                  fontSize: "16px",
                  borderColor: green[600],
                  color: green[600],
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: green[600],
                    color: "white",
                  },
                  flex: 4,
                }}
                onClick={handleButtonClick}
              >
                Create View
              </Button>
              <IconButton onClick={() => setShowSidebar(false)}>
                <ChevronLeftIcon
                  sx={{
                    color: green[600],
                  }}
                />
              </IconButton>
            </Box>
            <ChatSidebar views={views} onSelectView={handleViewSelect} />
          </Grid>
        )}
        {!showSidebar && (
          <IconButton
            onClick={() => setShowSidebar(true)}
            style={{ position: "absolute", left: 0 }}
          >
            <ChevronRightIcon
              sx={{
                color: green[600],
              }}
            />
          </IconButton>
        )}
        <Grid item xs={showSidebar ? 10 : 12}>
          <ChatPanel view={selectedView} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Chat;
