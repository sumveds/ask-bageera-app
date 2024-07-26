import React from "react";

import { Box, Typography } from "@mui/material";
import { blue, red } from "@mui/material/colors";

import CodeSnippet from "../../../components/CodeSnippet";
import QueryResultsPanel from "./QueryResultsPanel";
import LoadingDots from "../LoadingDots";

interface Message {
  type: "user" | "bot";
  textMessage: string;
  sqlQuery?: string;
  tableData?: Array<{ [key: string]: any }>;
  loading: boolean;
}

const ChatMessage = (props: { message: Message }) => {
  const { message } = props;
  const isUserMessage = message.type === "user";
  const messageLabel = isUserMessage ? "You: " : "Bageera: ";
  let messageContent;

  if (message.tableData) {
    if (message.tableData.length > 0) {
      messageContent = <QueryResultsPanel tableData={message.tableData} />;
    } else {
      messageContent = (
        <Box
          bgcolor={isUserMessage ? blue[50] : red[50]}
          p={1}
          borderRadius={1}
          maxWidth={"90%"}
        >
          <Typography variant="body2" color="textSecondary">
            No records found.
          </Typography>
        </Box>
      );
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      marginBottom={1}
    >
      <Typography
        component={"span"}
        gutterBottom
        marginBottom={1}
        maxWidth={"90%"}
        fontSize={"15px"}
      >
        <span
          style={{
            color: isUserMessage ? blue[600] : red[500],
            fontWeight: "bold",
          }}
        >
          {message.loading ? <LoadingDots /> : messageLabel}
        </span>
        {message.textMessage}
      </Typography>
      <Typography component={"span"} minWidth={"100%"}>
        {message.sqlQuery && <CodeSnippet code={message.sqlQuery} />}
        {messageContent}
      </Typography>
    </Box>
  );
};

export default ChatMessage;
