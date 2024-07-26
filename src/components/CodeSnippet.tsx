import React, { useState } from "react";
import { Box, IconButton, Snackbar, SnackbarCloseReason } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { blue, yellow } from "@mui/material/colors";
import { min } from "lodash";

interface CodeProps {
  code: string;
}

const CodeSnippet: React.FC<CodeProps> = ({ code }) => {
  const [open, setOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setOpen(true);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: "90%",
          backgroundColor: yellow[50],
          borderRadius: "5px",
          whiteSpace: "pre-wrap",
          marginTop: "10px",
          marginBottom: "10px",
          fontFamily: "Monaco, Menlo, Consolas, Courier, monospace",
          fontSize: "14px",
          padding: "calc(0.5rem + 1px)",
        }}
      >
        <code>{code}</code>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: "1rem",
        }}
      >
        <IconButton
          style={{ color: blue[500] }}
          aria-label="copy"
          onClick={copyToClipboard}
        >
          <ContentCopyIcon />
        </IconButton>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        message="Code copied to clipboard!"
      />
    </Box>
  );
};

export default CodeSnippet;
