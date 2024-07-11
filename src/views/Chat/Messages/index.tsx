import React from "react";
import { Grid } from "@mui/material";
import { Room, Message } from "../../../types";
import StartChatting from "./StartChatting";
import Input from "./Input";
import Header from "./Header";
import MessagesList from "./MessagesList";

type MessagesProps = {
  room?: Room | null;
  onCreateRoom: (callback: (createdRoom: Room["roomId"]) => void) => void;
  onSendMessage: (roomId: Room["roomId"], text: string) => void;
  onUpdateMessage: (
    messageId: Message["messageId"],
    newText: Message["text"],
  ) => void;
  onDeleteMessage: (messageId: Message["messageId"]) => void;
};

function Messages({
  room,
  onCreateRoom,
  onSendMessage,
  onUpdateMessage,
  onDeleteMessage,
}: MessagesProps) {
  if (!room) {
    return null;
  }

  const { messages } = room;

  const handleSendFirstMessage = (message: string) => {
    onCreateRoom((roomId) => {
      onSendMessage(roomId, message);
    });
  };

  const handleSendMessage = (message: string) => {
    onSendMessage(room.roomId, message);
  };

  const handleSend =
    messages.length === 0 ? handleSendFirstMessage : handleSendMessage;

  return (
    <Grid
      item
      md={9}
      sx={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <Header participants={room.participants} />
      {messages.length === 0 ? (
        <StartChatting />
      ) : (
        <MessagesList
          messages={messages}
          participants={room.participants}
          onUpdateMessage={onUpdateMessage}
          onDeleteMessage={onDeleteMessage}
        />
      )}
      <Input onSubmit={handleSend} />
    </Grid>
  );
}

export default Messages;
