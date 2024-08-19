import React from "react";
import { Grid } from "@mui/material";
import { Room, Message } from "../../../types";
import StartChatting from "./StartChatting";
import Input from "./Input";
import Header from "./Header";
import MessagesList from "./MessagesList";
import JoinChatBanner from "./JoinChatBanner";

type MessagesProps = {
  newRoom: Room | null;
  selectedRoom: Room | null;
  onCreateRoom: (callback: (createdRoom: Room["roomId"]) => void) => void;
  onLoadMoreMessages: (roomId: Room["roomId"], page: number) => void;
  onSendMessage: (roomId: Room["roomId"], text: string) => void;
  onUpdateMessage: (
    messageId: Message["messageId"],
    newText: Message["text"],
  ) => void;
  onDeleteMessage: (messageId: Message["messageId"]) => void;
};

function Messages({
  newRoom,
  selectedRoom,
  onCreateRoom,
  onLoadMoreMessages,
  onSendMessage,
  onUpdateMessage,
  onDeleteMessage,
}: MessagesProps) {
  if (!newRoom && !selectedRoom) {
    return null;
  }

  const room = (newRoom ?? selectedRoom) as Room;

  const handleSendFirstMessage = (message: string) => {
    onCreateRoom((roomId) => {
      onSendMessage(roomId, message);
    });
  };

  const handleSendMessage = (message: string) => {
    onSendMessage(room.roomId, message);
  };

  const handleSend = newRoom ? handleSendFirstMessage : handleSendMessage;

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
      {room.messages.length === 0 ? (
        <StartChatting />
      ) : (
        <MessagesList
          key={room.roomId}
          room={room}
          isNewRoom={Boolean(newRoom)}
          onLoadMoreMessages={onLoadMoreMessages}
          onUpdateMessage={onUpdateMessage}
          onDeleteMessage={onDeleteMessage}
        />
      )}
      {Boolean(newRoom) && Number(newRoom?.messages?.length) > 0 && (
        <JoinChatBanner />
      )}
      <Input onSubmit={handleSend} />
    </Grid>
  );
}

export default Messages;
