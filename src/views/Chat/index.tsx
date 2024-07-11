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
import { useDispatch, useSelector } from "react-redux";
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
} from "../../store/roomsSlice";

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

function Chat({ socket }: ChatProps) {
  const dispatch = useDispatch();
  const rooms = useSelector(selectAllRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<Room["roomId"] | null>(
    null,
  );
  const [newRoom, setNewRoom] = useState<Room | null>(null);

  useEffect(() => {
    socket.emit(ChatEvents.getUserRooms, (rooms: Room[]) => {
      dispatch(addRooms(rooms));
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
      ChatEvents.message,
      (roomId: Room["roomId"], message: Message) => {
        dispatch(newMessage({ roomId, message }));
      },
    );

    socket.on(
      ChatEvents.updateMessage,
      (roomId: Room["roomId"], updatedMessage: Omit<Message, "author">) => {
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
      socket.off(ChatEvents.message);
      socket.off(ChatEvents.updateMessage);
      socket.off(ChatEvents.deleteMessage);
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
        dispatch(addRooms([createdRoom, ...rooms]));
        setNewRoom(null);
        setSelectedRoomId(createdRoom.roomId);
        callback(createdRoom.roomId);
      },
    );
  };

  const handleDeleteRoom = (deletedRoomId: Room["roomId"]) => {
    socket.emit(ChatEvents.leaveRoom, deletedRoomId, () => {
      dispatch(deleteRoom(deletedRoomId));
      setSelectedRoomId(null);
    });
  };

  const handleSendMessage = (roomId: Room["roomId"], text: string) => {
    socket.emit("message", roomId, text, (message: Message) => {
      dispatch(newMessage({ roomId, message }));
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

  const selectedRoom = rooms.find(({ roomId }) => roomId === selectedRoomId);

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
