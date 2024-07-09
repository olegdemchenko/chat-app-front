import React from "react";
import { Box } from "@mui/material";
import { Message, Participant } from "../../../types";
import MessageItem from "./MessageItem";

type MessagesListProps = {
  messages: Message[];
  participants: Participant[];
};

function MessagesList({ messages, participants }: MessagesListProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight={0}
      rowGap={2}
      paddingX={6}
      paddingY={4}
      overflow="auto"
    >
      {messages.map((message) => (
        <MessageItem
          key={message.messageId}
          message={message}
          participant={participants.find(
            ({ userId }) => message.author === userId,
          )}
        />
      ))}
    </Box>
  );
}

export default MessagesList;
