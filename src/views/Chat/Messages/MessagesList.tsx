import React, { useContext, useState, useLayoutEffect, useRef } from "react";
import { Box, LinearProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { Message, Participant, Profile, Room } from "types";
import UserOwnMessage from "./UserOwnMessage";
import ParticipantMessage from "./ParticipantMessage";
import SystemMessage from "./SystemMessage";
import { RoomTypes } from "app/constants";
import { markMessagesAsRead } from "store/roomsSlice";
import { ChatEvents } from "app/constants";
import SocketContext from "contexts/SocketContext";
import ProfileContext from "contexts/ProfileContext";
import { Socket } from "socket.io-client";
import InViewObserver from "components/InViewObserver";
import { InView } from "react-intersection-observer";

type MessagesListProps = {
  room: Room;
  roomType: RoomTypes | null;
  onLoadMoreMessages: (
    roomId: Room["roomId"],
    page: number,
    onLoadEnd: () => void,
  ) => void;
  onUpdateMessage: (
    roomId: Room["roomId"],
    messageId: Message["messageId"],
    newText: Message["text"],
  ) => void;
  onDeleteMessage: (
    roomId: Room["roomId"],
    messageId: Message["messageId"],
  ) => void;
};

function MessagesList({
  room,
  roomType,
  onLoadMoreMessages,
  onUpdateMessage,
  onDeleteMessage,
}: MessagesListProps) {
  const socket = useContext(SocketContext) as Socket;
  const { userId } = useContext(ProfileContext) as Profile;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { messages, participants, messagesCount, roomId } = room;
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages[0]?.messageId ?? null;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo(0, container.scrollHeight);
    }
  }, [lastMessageId]);

  const handleLoadMoreMessages = () => {
    setIsLoading(true);
    onLoadMoreMessages(room.roomId, messages.length, () => setIsLoading(false));
  };

  const noMessagesLeft =
    roomType === RoomTypes.new || messagesCount === messages.length;

  const handleReadMessage = (message: Message) => () => {
    const wasMessageRead = message.readBy.includes(userId);
    if (!wasMessageRead && roomType === RoomTypes.connected) {
      socket.emit(ChatEvents.readMessages, {
        messagesIds: [message.messageId],
        userId,
      });
      dispatch(
        markMessagesAsRead({
          messagesIds: [message.messageId],
          roomId,
          userId,
        }),
      );
    }
  };

  return (
    <Box
      component="div"
      display="flex"
      flexDirection="column-reverse"
      paddingX={6}
      paddingBottom={4}
      marginTop={4}
      paddingTop={1}
      overflow="auto"
      ref={containerRef}
    >
      {messages.map((message) => {
        if (message.author === "system") {
          return (
            <InViewObserver
              onInView={handleReadMessage(message)}
              key={`${message.messageId}${roomType}`}
            >
              <SystemMessage message={message} key={message.messageId} />
            </InViewObserver>
          );
        }
        const isUserAuthor = userId === message.author;
        const messageAuthor = participants.find(
          ({ userId }) => message.author === userId,
        ) as Participant;
        return isUserAuthor ? (
          <UserOwnMessage
            key={message.messageId}
            message={message}
            onUpdateMessage={onUpdateMessage.bind(null, room.roomId)}
            onDeleteMessage={onDeleteMessage.bind(null, room.roomId)}
          />
        ) : (
          <InViewObserver
            onInView={handleReadMessage(message)}
            key={`${message.messageId}${roomType}`}
          >
            <ParticipantMessage message={message} author={messageAuthor} />
          </InViewObserver>
        );
      })}
      {isLoading && <LinearProgress />}
      <InView
        onChange={(inView) => {
          if (inView && !noMessagesLeft) {
            console.log("in view");
            handleLoadMoreMessages();
          }
        }}
      />
    </Box>
  );
}

export default MessagesList;
