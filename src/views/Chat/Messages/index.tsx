import React, { useContext, useEffect } from "react";
import { Grid } from "@mui/material";
import { Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { Room, Message } from "types";
import StartChatting from "./StartChatting";
import Input from "./Input";
import Header from "./Header";
import MessagesList from "./MessagesList";
import JoinChatBanner from "./JoinChatBanner";
import SocketContext from "contexts/SocketContext";
import ProfileContext from "contexts/ProfileContext";
import { ChatEvents } from "app/constants";
import { Profile } from "types";
import {
  saveExtraMessages,
  newMessage,
  messageSent,
  updateMessage,
  deleteMessage,
} from "store/roomsSlice";
import { RoomTypes } from "app/constants";

type MessagesProps = {
  room: Room | null;
  roomType: RoomTypes | null;
  onJoinRoom: (callback: (joinedRoomId: Room["roomId"]) => void) => void;
};

function Messages({ room, roomType, onJoinRoom }: MessagesProps) {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext) as Socket;
  const { userId } = useContext(ProfileContext) as Profile;

  useEffect(() => {
    socket.on(
      ChatEvents.newMessage,
      (roomId: Room["roomId"], message: Message) => {
        dispatch(newMessage({ roomId, message }));
      },
    );
    socket.on(
      ChatEvents.updateMessage,
      (roomId: Room["roomId"], updatedMessage: Message) => {
        dispatch(updateMessage({ roomId, updatedMessage }));
      },
    );

    socket.on(
      ChatEvents.deleteMessage,
      (roomId: Room["roomId"], messageId: Message["messageId"]) => {
        dispatch(deleteMessage({ roomId, messageId }));
      },
    );

    return () => {
      socket.off(ChatEvents.updateMessage);
      socket.off(ChatEvents.deleteMessage);
      socket.off(ChatEvents.newMessage);
    };
  }, []);

  const handleLoadMoreMessages = (roomId: Room["roomId"], skip: number) => {
    socket.emit(
      ChatEvents.loadMoreMessages,
      { roomId, skip },
      (messages: Message[]) => {
        dispatch(saveExtraMessages({ roomId, messages }));
      },
    );
  };

  const handleSendMessage = (roomId: Room["roomId"], text: string) => {
    socket.emit(
      ChatEvents.newMessage,
      { roomId, text, author: userId },
      (message: Message) => {
        dispatch(messageSent({ roomId, message }));
      },
    );
  };

  const handleUpdateMessage = (
    roomId: Room["roomId"],
    messageId: Message["messageId"],
    newText: Message["text"],
  ) => {
    socket.emit(
      ChatEvents.updateMessage,
      { messageId, roomId, newText },
      (updatedMessage: Message) => {
        dispatch(updateMessage({ roomId, updatedMessage }));
      },
    );
  };

  const handleDeleteMessage = (
    roomId: Room["roomId"],
    messageId: Message["messageId"],
  ) => {
    socket.emit(ChatEvents.deleteMessage, { roomId, messageId }, () => {
      dispatch(deleteMessage({ roomId, messageId }));
    });
  };

  const handleJoinRoom = (message: string) => {
    onJoinRoom((roomId) => {
      handleSendMessage(roomId, message);
    });
  };

  const handleSubmit =
    roomType === RoomTypes.connected
      ? (message: string) => handleSendMessage(room!.roomId, message)
      : handleJoinRoom;

  if (!room) {
    return null;
  }

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
      {roomType === RoomTypes.new ? (
        <StartChatting />
      ) : (
        <MessagesList
          key={room.roomId}
          room={room}
          roomType={roomType}
          onLoadMoreMessages={handleLoadMoreMessages}
          onUpdateMessage={handleUpdateMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      )}
      {roomType === RoomTypes.disconnected && <JoinChatBanner />}
      <Input onSubmit={handleSubmit} />
    </Grid>
  );
}

export default Messages;
