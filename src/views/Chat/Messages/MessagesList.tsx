import React, { useState } from "react";
import { Box } from "@mui/material";
import { Message, Room } from "../../../types";
import UserOwnMessage from "./UserOwnMessage";
import ParticipantMessage from "./ParticipantMessage";
import SystemMessage from "./SystemMessage";
import ScrollableList from "../../../components/ScrollableList";

type MessagesListProps = {
  room: Room;
  isNewRoom: boolean;
  onLoadMoreMessages: (roomId: Room["roomId"], page: number) => void;
  onUpdateMessage: (
    messageId: Message["messageId"],
    newText: Message["text"],
  ) => void;
  onDeleteMessage: (messageId: Message["messageId"]) => void;
};

function MessagesList({
  room,
  isNewRoom,
  onLoadMoreMessages,
  onUpdateMessage,
  onDeleteMessage,
}: MessagesListProps) {
  const { messages, participants, messagesCount } = room;

  const handleLoadMoreMessages = () => {
    onLoadMoreMessages(room.roomId, messages.length);
  };

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
      <ScrollableList
        direction="top"
        elements={messages.map((message) => {
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
        isListExausted={isNewRoom || messagesCount === messages.length}
        onReachEnd={handleLoadMoreMessages}
      />
    </Box>
  );
}

export default MessagesList;
