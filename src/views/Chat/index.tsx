import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import Container from "./Container";
import Aside from "./Aside";
import Label from "./Label";
import { Participant, Room } from "../../types";
import Search from "./Search";
import RoomsList from "./RoomsList/RoomsList";
import CurrentRoom from "./CurrentRoom";
import CreateRoom from "./CreateRoom";
import { ChatEvents } from "../../constants";

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
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<Room | null>(null);

  useEffect(() => {
    socket.emit(ChatEvents.getUserRooms, setRooms);
  }, []);

  useEffect(() => {
    socket.on("userJoin", (userId: Participant["userId"]) => {
      setRooms(rooms.map((room) => changeUserStatus(room, userId, true)));
    });
    socket.on("userLeave", (userId: Participant["userId"]) => {
      setRooms(rooms.map((room) => changeUserStatus(room, userId, false)));
    });

    return () => {
      socket.off("userJoin");
      socket.off("userLeave");
    };
  }, [rooms]);

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
      setSelectedRoom(existingRoom);
    } else {
      setNewRoom({
        roomId: "newRoomId",
        participants: [participant],
      });
      setSelectedRoom(null);
    }
    handleClearSearchResults();
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setNewRoom(null);
  };

  const handleCreateRoom = () => {
    socket.emit(
      ChatEvents.createRoom,
      newRoom?.participants[0].userId,
      (newRoomId: string) => {
        const createdRoom = {
          roomId: newRoomId,
          participants: [...newRoom!.participants],
        };
        setRooms([createdRoom, ...rooms]);
        setNewRoom(null);
        setSelectedRoom(createdRoom);
      },
    );
  };

  const handleDeleteRoom = (deletedRoomId: Room["roomId"]) => {
    socket.emit(ChatEvents.leaveRoom, deletedRoomId, () => {
      setRooms(rooms.filter(({ roomId }) => roomId !== deletedRoomId));
      setSelectedRoom(null);
    });
  };

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
        {newRoom && (
          <CreateRoom
            secondParticipantId={newRoom.participants[0].userId}
            onCreate={handleCreateRoom}
          />
        )}
        {selectedRoom && <CurrentRoom room={selectedRoom} />}
      </>
    </Container>
  );
}

export default Chat;
