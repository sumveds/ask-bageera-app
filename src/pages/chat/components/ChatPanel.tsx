import React, { useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Container,
  Grid,
  TextField,
  Theme,
  styled,
  useTheme,
} from "@mui/material";
import { isEmpty } from "lodash";

import { askQuestion, getChatHistory } from "../../../services/chat-service";
import ChatMessage from "./ChatMessage";
import { View } from "../../../types";

interface Message {
  type: "user" | "bot";
  textMessage: string;
  sqlQuery?: string;
  tableData?: Array<{ [key: string]: any }>;
  loading: boolean;
}

const InputContainer = styled(Grid)(({ theme }: { theme: Theme }) => ({
  position: "sticky",
  bottom: 0,
  background: "#fff",
  padding: theme.spacing(2),
}));

const FullWidthTextField = styled(TextField)({
  flexGrow: 1,
});

const ChatPanel = (props: { view: View }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");
  const { getAccessTokenSilently } = useAuth0();
  const { view } = props;
  const theme = useTheme();
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const accessToken = await getAccessTokenSilently();
      const chats = await getChatHistory(accessToken, view.id);
      const history: Message[] = [];
      history.push(
        {
          type: "bot",
          textMessage: "Welcome! How can I help you today?",
          loading: false,
        },
        {
          type: "bot",
          textMessage:
            "You can ask free form questions. Clear and concise questions give you the best results.",
          loading: false,
        }
      );
      chats.forEach((chat: any) => {
        const { question, response } = chat;
        const { query, explanation, tableData } = response;
        history.push(
          {
            type: "user",
            textMessage: question,
            loading: false,
          },
          {
            type: "bot",
            sqlQuery: query,
            textMessage: explanation,
            tableData: tableData,
            loading: false,
          }
        );
      });
      setMessages(history);
    };
    fetchChatHistory();
  }, [getAccessTokenSilently, view]);

  useEffect(() => {
    // Get the index of the latest user message
    let lastUserMsgIndex = messages.length - 1;
    while (
      lastUserMsgIndex >= 0 &&
      messages[lastUserMsgIndex].type !== "user"
    ) {
      lastUserMsgIndex--;
    }

    // If there is a user message
    if (lastUserMsgIndex >= 0) {
      const lastUserMsgRef = messageRefs.current[lastUserMsgIndex];
      if (lastUserMsgRef) {
        lastUserMsgRef.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    // Add user message to messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: "user",
        textMessage: userMessage,
        loading: false,
      },
      {
        type: "bot",
        textMessage: "",
        loading: true, // Set loading flag for "Bageera: ..." message
      },
    ]);
    const messageToSend = userMessage; // Store the user message to send
    setUserMessage(""); // Clear the user message immediately
    const accessToken = await getAccessTokenSilently();
    const botResponse = await askQuestion(view, messageToSend, accessToken); // Use the stored user message
    const botMessages: Message[] = botResponse.results.map(
      (botMessage: any) => {
        const { query, explanation, tableData } = botMessage;
        return {
          type: "bot",
          tableData: tableData,
          textMessage: explanation,
          sqlQuery: query,
          loading: false,
        };
      }
    );
    // Update the user message with loading=false
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const userMessageIndex = updatedMessages.findIndex(
        (message) => message.loading && message.type === "user"
      );
      if (userMessageIndex !== -1) {
        updatedMessages.splice(userMessageIndex, 1, {
          ...updatedMessages[userMessageIndex],
          loading: false,
        });
      }
      const botMessageIndex = updatedMessages.findIndex(
        (message) => message.loading && message.type === "bot"
      );
      if (botMessageIndex !== -1) {
        updatedMessages.splice(botMessageIndex, 1, ...botMessages);
      }
      return updatedMessages;
    });
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !messages.some((message) => message.loading)
    ) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        height: `calc(100vh - 100px)`, // Adjust this based on the height of your header
        position: "relative",
        marginTop: theme.spacing(2),
        // marginLeft: theme.spacing(5),
      }}
    >
      <Grid
        container
        direction="column"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Grid item xs style={{ overflowY: "auto", flex: 1, padding: "16px" }}>
          {messages.map((message, i) => {
            return (
              <div ref={(el) => (messageRefs.current[i] = el)} key={i}>
                <ChatMessage message={message} />
              </div>
            );
          })}
        </Grid>
        <Grid item>
          <InputContainer container alignItems="flex-end">
            <Grid item xs={11}>
              <FullWidthTextField
                autoFocus
                disabled={messages.some((message) => message.loading)}
                fullWidth
                label="Ask free form data questions"
                value={userMessage}
                onKeyPress={handleKeyPress}
                onChange={(e) => setUserMessage(e.target.value)}
                multiline
              />
            </Grid>
            <Grid item xs={1} paddingLeft={"2px"}>
              <Button
                onClick={handleSendMessage}
                disabled={
                  messages.some((message) => message.loading) ||
                  isEmpty(userMessage)
                }
              >
                Send
              </Button>
            </Grid>
          </InputContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ChatPanel;
