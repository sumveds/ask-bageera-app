import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { blue, grey, red, yellow } from "@mui/material/colors";

import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/bageera-01.svg";

interface HeaderProps {
  handleOpenDialog: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleOpenDialog }) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isAuthenticated, logout } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setAnchorEl(null);
    }
  }, [isAuthenticated]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: grey[900] }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <img src={logo} height="20px" alt="Company Logo" />
        </IconButton>
        <div style={{ marginLeft: "auto" }} />
        {isAuthenticated && (
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                "& .MuiSvgIcon-root": {
                  color: blue[400],
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 0 10px 1px rgba(0, 0, 255, 0.5)",
                  },
                },
              }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  logout({
                    logoutParams: {
                      returnTo: window.location.origin,
                    },
                  });
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
