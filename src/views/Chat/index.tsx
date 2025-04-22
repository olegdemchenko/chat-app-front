import React, { useState, useContext } from "react";
import { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import Container from "./Container";
import Aside from "./Aside";
import Label from "./Label";
import { Participant, Room } from "types";
import Search from "./Search";
import Rooms from "./Rooms";
import { ChatEvents } from "app/constants";
import Messages from "./Messages";
import Logout from "./Logout";
import { Profile } from "types";
import { RoomTypes } from "app/constants";

import { selectAllRooms, addRoom, deleteRoom } from "store/roomsSlice";
import ProfileContext from "contexts/ProfileContext";
import SocketContext from "contexts/SocketContext";

function Chat() {
  const socket = useContext(SocketContext) as Socket;
  const dispatch = useDispatch();
  const rooms = useSelector(selectAllRooms);
  const { userId, name } = useContext(ProfileContext) as Profile;
  const [selectedRoomId, setSelectedRoomId] = useState<Room["roomId"] | null>(
    null,
  );
  const [newRoom, setNewRoom] = useState<Room | null>(null);
  const [roomType, setRoomType] = useState<RoomTypes | null>(null);

  const selectedRoom =
    rooms.find(({ roomId }) => roomId === selectedRoomId) ?? null;

  const handleSelectParticipant = (participant: Participant) => {
    const existingRoom = rooms.find(
      ({ participants }) => participants[0].userId === participant.userId,
    );
    if (existingRoom) {
      setNewRoom(null);
      setSelectedRoomId(existingRoom.roomId);
      setRoomType(RoomTypes.connected);
    } else {
      socket.emit(
        ChatEvents.findRoom,
        { participantsIds: [participant.userId, userId], userId },
        (foundRoom: Room | "none") => {
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
          setRoomType(
            foundRoom !== "none" ? RoomTypes.disconnected : RoomTypes.new,
          );
        },
      );
    }
  };

  const handleSelectRoom = (roomId: Room["roomId"]) => {
    setSelectedRoomId(roomId);
    setNewRoom(null);
    setRoomType(RoomTypes.connected);
  };

  const handleCreateRoom = (callback: (roomId: Room["roomId"]) => void) => {
    const updateRoomsState = (newRoom: Room) => {
      dispatch(addRoom(newRoom));
      setNewRoom(null);
      setSelectedRoomId(newRoom.roomId);
      setRoomType(RoomTypes.connected);
      callback(newRoom.roomId);
    };

    roomType === RoomTypes.disconnected
      ? socket.emit(
          ChatEvents.connectToRoom,
          { roomId: newRoom?.roomId, userId, userName: name },
          () => {
            updateRoomsState(newRoom as Room);
          },
        )
      : socket.emit(
          ChatEvents.createRoom,
          [userId, newRoom?.participants[0].userId],
          (createdRoom: Room) => {
            updateRoomsState(createdRoom);
          },
        );
  };

  const handleDeleteRoom = (deletedRoomId: Room["roomId"]) => {
    socket.emit(
      ChatEvents.deleteRoom,
      { roomId: deletedRoomId, userId, userName: name },
      () => {
        dispatch(deleteRoom(deletedRoomId));
        setSelectedRoomId(null);
      },
    );
  };

  return (
    <Container>
      <>
        <Aside>
          <Box>
            <Label />
            <Search onSelect={handleSelectParticipant} />
            <Rooms
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
          room={newRoom ?? selectedRoom}
          roomType={roomType}
          onJoinRoom={handleCreateRoom}
        />
      </>
    </Container>
  );
}

export default Chat;
