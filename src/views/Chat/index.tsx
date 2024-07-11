import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import Container from "./Container";
import Aside from "./Aside";
import Label from "./Label";
import { Message, Participant, Room } from "../../types";
import Search from "./Search";
import RoomsList from "./RoomsList";
import { ChatEvents } from "../../constants";
import Messages from "./Messages";

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

const changeUserStatus = (
  room: Room,
  userId: Participant["userId"],
  isOnline: boolean,
) => {
  return {
    ...room,
    participants: room.participants.map((participant) => {
      return {
        ...participant,
        isOnline:
          userId === participant.userId ? isOnline : participant.isOnline,
      };
    }),
  };
};

function Chat({ socket }: ChatProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<Room["roomId"] | null>(
    null,
  );
  const [newRoom, setNewRoom] = useState<Room | null>(null);

  useEffect(() => {
    socket.emit(ChatEvents.getUserRooms, setRooms);
  }, []);

  useEffect(() => {
    socket.on(ChatEvents.userJoin, (userId: Participant["userId"]) => {
      setRooms((rooms) =>
        rooms.map((room) => changeUserStatus(room, userId, true)),
      );
    });
    socket.on(ChatEvents.userLeave, (userId: Participant["userId"]) => {
      setRooms((rooms) =>
        rooms.map((room) => changeUserStatus(room, userId, false)),
      );
    });
    socket.on(ChatEvents.newRoom, (newRoom: Room) => {
      setRooms((rooms) => [newRoom, ...rooms]);
    });
    socket.on(
      ChatEvents.message,
      (roomId: Room["roomId"], message: Message) => {
        setRooms((rooms) =>
          rooms.map((room) => {
            if (room.roomId === roomId) {
              return { ...room, messages: [...room.messages, message] };
            }
            return room;
          }),
        );
      },
    );

    socket.on(
      ChatEvents.updateMessage,
      (roomId: Room["roomId"], updatedMessage: Omit<Message, "author">) => {
        setRooms((rooms) =>
          rooms.map((room) => {
            if (room.roomId === roomId) {
              return {
                ...room,
                messages: room.messages.map((message) => {
                  if (message.messageId === updatedMessage.messageId) {
                    return { ...message, ...updatedMessage };
                  }
                  return message;
                }),
              };
            }
            return room;
          }),
        );
      },
    );

    socket.on(
      ChatEvents.deleteMessage,
      (roomId: Room["roomId"], messageId: Message["messageId"]) => {
        setRooms((rooms) =>
          rooms.map((room) => {
            if (room.roomId === roomId) {
              return {
                ...room,
                messages: room.messages.filter(
                  (room) => room.messageId !== messageId,
                ),
              };
            }
            return room;
          }),
        );
      },
    );

    return () => {
      socket.off(ChatEvents.userJoin);
      socket.off(ChatEvents.userLeave);
      socket.off(ChatEvents.newRoom);
      socket.off(ChatEvents.message);
      socket.off(ChatEvents.updateMessage);
    };
  }, []);

  const [searchResults, setSearchResults] = useState<Results>(initialResults);

  const handleEnterQuery = (query: string) => {
    if (query.length === 0) {
      setSearchResults(initialResults);
      return;
    }
    socket.emit(
      ChatEvents.findUsers,
      query,
      0,
      (users: Participant[], count: number) => {
        setSearchResults({ query, users, count });
      },
    );
  };

  const handleLoadMoreResults = (page: number, successCallback: () => void) => {
    socket.emit(
      ChatEvents.findUsers,
      searchResults.query,
      page,
      (foundUsers: Participant[]) => {
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
      setNewRoom({
        roomId: "newRoomId",
        participants: [participant],
        messages: [],
      });
      setSelectedRoomId(null);
    }
    handleClearSearchResults();
  };

  const handleSelectRoom = (roomId: Room["roomId"]) => {
    setSelectedRoomId(roomId);
    setNewRoom(null);
  };

  const handleCreateRoom = (callback: (roomId: Room["roomId"]) => void) => {
    socket.emit(
      ChatEvents.createRoom,
      newRoom?.participants[0].userId,
      (newRoomId: string) => {
        const createdRoom = {
          roomId: newRoomId,
          participants: [...newRoom!.participants],
          messages: [],
        };
        setRooms([createdRoom, ...rooms]);
        setNewRoom(null);
        setSelectedRoomId(createdRoom.roomId);
        callback(createdRoom.roomId);
      },
    );
  };

  const handleDeleteRoom = (deletedRoomId: Room["roomId"]) => {
    socket.emit(ChatEvents.leaveRoom, deletedRoomId, () => {
      setRooms(rooms.filter(({ roomId }) => roomId !== deletedRoomId));
      setSelectedRoomId(null);
    });
  };

  const handleSendMessage = (roomId: Room["roomId"], text: string) => {
    socket.emit("message", roomId, text, (newMessage: Message) => {
      setRooms((rooms) =>
        rooms.map((room) => {
          if (room.roomId === roomId) {
            return { ...room, messages: [...room.messages, newMessage] };
          }
          return room;
        }),
      );
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
      (updatedMessage: Omit<Message, "author">) => {
        setRooms((rooms) =>
          rooms.map((room) => {
            if (room.roomId === selectedRoomId) {
              return {
                ...room,
                messages: room.messages.map((message) => {
                  if (message.messageId === messageId) {
                    return { ...message, ...updatedMessage };
                  }
                  return message;
                }),
              };
            }
            return room;
          }),
        );
      },
    );
  };

  const handleDeleteMessage = (messageId: Message["messageId"]) => {
    socket.emit(
      ChatEvents.deleteMessage,
      selectedRoom?.roomId,
      messageId,
      () => {
        setRooms((rooms) =>
          rooms.map((room) => {
            if (room.roomId === selectedRoom?.roomId) {
              return {
                ...room,
                messages: room.messages.filter(
                  (message) => message.messageId !== messageId,
                ),
              };
            }
            return room;
          }),
        );
      },
    );
  };

  const selectedRoom = rooms.find(({ roomId }) => roomId === selectedRoomId);
  console.log("rooms", rooms);

  return (
    <Container>
      <>
        <Aside>
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
        </Aside>
        <Messages
          room={newRoom || selectedRoom}
          onCreateRoom={handleCreateRoom}
          onSendMessage={handleSendMessage}
          onUpdateMessage={handleUpdateMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </>
    </Container>
  );
}

export default Chat;
