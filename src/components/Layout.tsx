import React, { useState } from "react";
import Header from "./Header";
import SessionEndDialog from "../pages/chat/components/SessionEndDialog";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <div>
      <Header handleOpenDialog={handleOpenDialog} />
      <div style={{ marginTop: "10px" }}>{children}</div>
      <SessionEndDialog open={openDialog} setOpen={setOpenDialog} />
    </div>
  );
};

export default Layout;
