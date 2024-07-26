import React, { useEffect, useRef, useState } from 'react';

import { Box, Grid } from '@mui/material';

import CloseButton from './CloseButton';
import SessionEndDialog from './SessionEndDialog';
import ChatMessage from './ChatMessage';

interface Message {
  type: 'user' | 'bot';
  textMessage: string;
  sqlQuery?: string;
  tableData?: Array<{ [key: string]: any }>;
  loading: boolean;
}

interface MessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<MessagesProps> = ({ messages }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    // Get the index of the latest bot message
    let lastBotMsgIndex = messages.length - 1;
    while (lastBotMsgIndex >= 0 && messages[lastBotMsgIndex].type !== 'bot') {
      lastBotMsgIndex--;
    }
    // If there is a bot message and a user message before it
    if (lastBotMsgIndex > 0) {
      const prevMsgRef = messageRefs.current[lastBotMsgIndex - 1];
      if (prevMsgRef) {
        prevMsgRef.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // If there is only one bot message and no user messages
    else if (lastBotMsgIndex === 0) {
      const firstMsgRef = messageRefs.current[0];
      if (firstMsgRef) {
        firstMsgRef.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);  

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <Grid item>
      <Grid item xs={11}>
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '16px',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: '4px',
            height: 'calc(90vh - 160px)',
          }}
        >
          <CloseButton handleOpenDialog={handleOpenDialog} />
          {messages.map((message, i) => {
            return (
              <div ref={(el) => (messageRefs.current[i] = el)}>
                <ChatMessage key={i} message={message} />
              </div>
            );
          })}
        </Box>
      </Grid>
      <SessionEndDialog open={openDialog} setOpen={setOpenDialog} />
    </Grid>
  );
};

export default ChatMessages;
