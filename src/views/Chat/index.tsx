import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import Container from "./Container";
import Aside from "./Aside";
import Label from "./Label";
import { Message, Participant, Room } from "../../types";
import Search from "./Search";
import RoomsList from "./RoomsList";
import { ChatEvents, MESSAGES_PER_PAGE } from "../../constants";
import Messages from "./Messages";
import Logout from "./Logout";

import {
  selectAllRooms,
  addRoom,
  deleteRoom,
  addRooms,
  userJoined,
  userLeft,
  newMessage,
  updateMessage,
  deleteMessage,
  saveExtraMessages,
  markMessagesAsRead,
} from "../../store/roomsSlice";
import { saveUserId, selectCurrentUserId } from "../../store/userSlice";

type ChatProps = {
  socket: Socket;
};

export type Results = {
  users: readonly Participant[];
  query: string;
  count: number;
};

const initialResults: Results = {
  users: [],
  count: 0,
  query: "",
};

const getUnreadMessagesIds = (messages: Message[], userId: string) => {
  return messages.reduce(
    (acc, message) =>
      message.readBy.includes(userId) ? acc : [...acc, message.messageId],
    [] as string[],
  );
};

function Chat({ socket }: ChatProps) {
  const dispatch = useDispatch();
  const rooms = useSelector(selectAllRooms);
  const userId = useSelector(selectCurrentUserId) as string;
  const [selectedRoomId, setSelectedRoomId] = useState<Room["roomId"] | null>(
    null,
  );
  const [newRoom, setNewRoom] = useState<Room | null>(null);

  const selectedRoom =
    rooms.find(({ roomId }) => roomId === selectedRoomId) ?? null;

  useEffect(() => {
    socket.emit(ChatEvents.getUserRooms, (rooms: Room[]) => {
      dispatch(addRooms(rooms));
    });
    socket.emit(ChatEvents.getUserId, (userId: string) => {
      dispatch(saveUserId(userId));
    });
  }, []);

  useEffect(() => {
    socket.on(ChatEvents.userJoin, (userId: Participant["userId"]) => {
      dispatch(userJoined(userId));
    });
    socket.on(ChatEvents.userLeave, (userId: Participant["userId"]) => {
      dispatch(userLeft(userId));
    });
    socket.on(ChatEvents.newRoom, (newRoom: Room) => {
      dispatch(addRoom(newRoom));
    });

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
      socket.off(ChatEvents.userJoin);
      socket.off(ChatEvents.userLeave);
      socket.off(ChatEvents.newRoom);
      socket.off(ChatEvents.updateMessage);
      socket.off(ChatEvents.deleteMessage);
    };
  }, []);

  useEffect(() => {
    if (!selectedRoom || !selectedRoomId) {
      return;
    }
    const unreadMessagesIds = getUnreadMessagesIds(
      selectedRoom.messages.slice(-MESSAGES_PER_PAGE),
      userId,
    );
    if (unreadMessagesIds.length > 0) {
      socket.emit(ChatEvents.readMessages, unreadMessagesIds);
      dispatch(
        markMessagesAsRead({
          messagesIds: unreadMessagesIds,
          roomId: selectedRoomId,
          userId,
        }),
      );
    }
  }, [selectedRoomId]);

  useEffect(() => {
    socket.on(
      ChatEvents.newMessage,
      (roomId: Room["roomId"], message: Message) => {
        dispatch(
          newMessage({ roomId, message, unread: selectedRoomId !== roomId }),
        );
        if (roomId === selectedRoomId) {
          socket.emit(ChatEvents.readMessages, [message.messageId]);
        }
      },
    );
    return () => {
      socket.off(ChatEvents.newMessage);
    };
  }, [selectedRoomId]);

  const [searchResults, setSearchResults] = useState<Results>(initialResults);

  const handleEnterQuery = (query: string) => {
    if (query.length === 0) {
      setSearchResults(initialResults);
      return;
    }
    socket.emit(
      ChatEvents.findUsers,
      { userId, query, page: 0 },
      ([users, count]: [users: Participant[], count: number]) => {
        setSearchResults({ query, users, count });
      },
    );
  };

  const handleLoadMoreResults = (page: number, successCallback: () => void) => {
    socket.emit(
      ChatEvents.findUsers,
      { query: searchResults.query, page, userId },
      ([foundUsers]: [users: Participant[], count: number]) => {
        setSearchResults({
          ...searchResults,
          users: [...searchResults.users, ...foundUsers],
        });
        successCallback();
      },
    );
  };

  const handleClearSearchResults = () => setSearchResults(initialResults);

  const handleSelectParticipant = (participant: Participant) => {
    const existingRoom = rooms.find(
      ({ participants }) => participants[0].userId === participant.userId,
    );
    if (existingRoom) {
      setNewRoom(null);
      setSelectedRoomId(existingRoom.roomId);
    } else {
      socket.emit(
        ChatEvents.findRoom,
        [participant.userId, userId],
        (foundRoom: Room | "none") => {
          console.log("found room", foundRoom);
          const room =
            foundRoom !== "none"
              ? { ...foundRoom, messages: foundRoom.messages.reverse() }
              : {
                  roomId: "newRoomId",
                  participants: [participant],
                  messages: [],
                  messagesCount: 0,
                  unreadMessagesCount: 0,
                };
          setNewRoom(room);
          setSelectedRoomId(null);
        },
      );
    }
    handleClearSearchResults();
  };

  const handleSelectRoom = (roomId: Room["roomId"]) => {
    setSelectedRoomId(roomId);
    setNewRoom(null);
  };

  const handleCreateRoom = (callback: (roomId: Room["roomId"]) => void) => {
    const updateRoomsState = (newRoom: Room) => {
      dispatch(addRoom(newRoom));
      setNewRoom(null);
      setSelectedRoomId(newRoom.roomId);
      callback(newRoom.roomId);
    };
    newRoom!.messages.length > 0
      ? socket.emit(ChatEvents.connectToRoom, newRoom?.roomId, () => {
          updateRoomsState(newRoom as Room);
        })
      : socket.emit(
          ChatEvents.createRoom,
          newRoom?.participants[0].userId,
          (createdRoom: Room) => {
            updateRoomsState(createdRoom);
          },
        );
  };

  const handleDeleteRoom = (deletedRoomId: Room["roomId"]) => {
    socket.emit(ChatEvents.deleteRoom, deletedRoomId, () => {
      dispatch(deleteRoom(deletedRoomId));
      setSelectedRoomId(null);
    });
  };

  const handleLoadMoreMessages = (roomId: Room["roomId"], skip: number) => {
    socket.emit(
      ChatEvents.loadMoreMessages,
      roomId,
      skip,
      (messages: Message[]) => {
        dispatch(saveExtraMessages({ roomId, messages }));
        const unreadMessagesIds = getUnreadMessagesIds(messages, userId);
        if (unreadMessagesIds.length > 0) {
          socket.emit(ChatEvents.readMessages, unreadMessagesIds);
          dispatch(
            markMessagesAsRead({
              messagesIds: unreadMessagesIds,
              userId,
              roomId,
            }),
          );
        }
      },
    );
  };

  const handleSendMessage = (roomId: Room["roomId"], text: string) => {
    socket.emit(ChatEvents.newMessage, roomId, text, (message: Message) => {
      dispatch(newMessage({ roomId, message, unread: false }));
    });
  };

  const handleUpdateMessage = (
    messageId: Message["messageId"],
    newText: Message["text"],
  ) => {
    socket.emit(
      ChatEvents.updateMessage,
      selectedRoomId,
      messageId,
      newText,
      (updatedMessage: Message) => {
        dispatch(updateMessage({ roomId: selectedRoomId!, updatedMessage }));
      },
    );
  };

  const handleDeleteMessage = (messageId: Message["messageId"]) => {
    socket.emit(
      ChatEvents.deleteMessage,
      selectedRoom?.roomId,
      messageId,
      () => {
        dispatch(deleteMessage({ roomId: selectedRoomId!, messageId }));
      },
    );
  };

  return (
    <Container>
      <>
        <Aside>
          <Box>
            <Label />
            <Search
              results={searchResults}
              onSubmit={handleEnterQuery}
              onLoadMore={handleLoadMoreResults}
              onClear={handleClearSearchResults}
              onSelect={handleSelectParticipant}
            />
            <RoomsList
              rooms={rooms}
              newRoom={newRoom}
              selectedRoom={selectedRoom}
              onSelect={handleSelectRoom}
              onDelete={handleDeleteRoom}
            />
          </Box>
          <Logout />
        </Aside>
        <Messages
          newRoom={newRoom}
          selectedRoom={selectedRoom}
          onCreateRoom={handleCreateRoom}
          onLoadMoreMessages={handleLoadMoreMessages}
          onSendMessage={handleSendMessage}
          onUpdateMessage={handleUpdateMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </>
    </Container>
  );
}

export default Chat;
