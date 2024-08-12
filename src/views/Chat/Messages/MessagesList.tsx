import React from "react";
import { Box } from "@mui/material";
import { Message, Participant } from "../../../types";
import UserOwnMessage from "./UserOwnMessage";
import ParticipantMessage from "./ParticipantMessage";
import SystemMessage from "./SystemMessage";

type MessagesListProps = {
  messages: Message[];
  participants: Participant[];
  onUpdateMessage: (
    messageId: Message["messageId"],
    newText: Message["text"],
  ) => void;
  onDeleteMessage: (messageId: Message["messageId"]) => void;
};

function MessagesList({
  messages,
  participants,
  onUpdateMessage,
  onDeleteMessage,
}: MessagesListProps) {
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
      {messages.map((message) => {
        if (message.author === "system") {
          return <SystemMessage message={message} key={message.messageId} />;
        }
        const author = participants.find(
          ({ userId }) => message.author === userId,
        );
        return author ? (
          <ParticipantMessage
            message={message}
            author={author}
            key={message.messageId}
          />
        ) : (
          <UserOwnMessage
            key={message.messageId}
            message={message}
            onUpdateMessage={onUpdateMessage}
            onDeleteMessage={onDeleteMessage}
          />
        );
      })}
    </Box>
  );
}

export default MessagesList;
