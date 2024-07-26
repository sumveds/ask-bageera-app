import React, { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { View } from "../../../types";
import { blue, green, grey } from "@mui/material/colors";
import { Typography } from "@mui/material";

interface ChatSidebarProps {
  views: View[];
  onSelectView: (view: View) => void;
}

const ChatSidebar = ({ views, onSelectView }: ChatSidebarProps) => {
  const [selectedView, setSelectedView] = useState<View>(views[0]);

  useEffect(() => {
    if (views.length > 0) {
      setSelectedView(views[0]); // Initialize with first view if available
      onSelectView(views[0]);
    }
  }, [views, onSelectView]);

  const handleViewSelect = (view: View) => {
    setSelectedView(view);
    onSelectView(view);
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {views.map((view) => (
        <ListItem
          button
          key={view.id}
          onClick={() => handleViewSelect(view)}
          selected={selectedView && selectedView.id == view.id}
          sx={{
            "&.Mui-selected": {
              backgroundColor: blue[300],
              color: "white",
              "&:hover": {
                backgroundColor: blue[300],
              },
            },
            "&:hover": {
              backgroundColor: blue[50],
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {view.name}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};

export default ChatSidebar;
