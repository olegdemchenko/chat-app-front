import React, { useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/material";
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

type MessagesListProps = {
  room: Room;
  roomType: RoomTypes | null;
  onLoadMoreMessages: (roomId: Room["roomId"], page: number) => void;
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
  const dispatch = useDispatch();
  const { messages, participants, messagesCount, roomId } = room;

  const handleLoadMoreMessages = () => {
    onLoadMoreMessages(room.roomId, messages.length);
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
      overflow="auto"
      id="scrollableDiv"
    >
      <InfiniteScroll
        dataLength={messagesCount}
        hasMore={!noMessagesLeft}
        loader={<LinearProgress />}
        next={handleLoadMoreMessages}
        scrollableTarget="scrollableDiv"
        inverse={true}
      >
        {messages.map((message) => {
          if (message.author === "system") {
            return (
              <InViewObserver
                onInView={handleReadMessage(message)}
                key={message.messageId}
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
              key={message.messageId}
            >
              <ParticipantMessage message={message} author={messageAuthor} />
            </InViewObserver>
          );
        })}
      </InfiniteScroll>
    </Box>
  );
}

export default MessagesList;
