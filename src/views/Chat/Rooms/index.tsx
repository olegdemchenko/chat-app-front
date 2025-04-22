import React, { useContext, useState, useEffect } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Room } from "types";
import DeleteRoomDialog from "./DeleteRoomDialog";
import RoomItem from "./Room";
import { ChatEvents } from "app/constants";
import SocketContext from "contexts/SocketContext";
import { Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { Profile } from "types";
import { addRoom, addRooms, userJoined, userLeft } from "store/roomsSlice";
import ProfileContext from "contexts/ProfileContext";
import { Participant } from "types";

type RoomsProps = {
  rooms: Room[];
  newRoom: Room | null;
  selectedRoom: Room | null;
  onSelect: (roomId: Room["roomId"]) => void;
  onDelete: (roomId: Room["roomId"]) => void;
};

function Rooms({
  rooms,
  newRoom,
  selectedRoom,
  onSelect,
  onDelete,
}: RoomsProps) {
  const socket = useContext(SocketContext) as Socket;
  const { userId } = useContext(ProfileContext) as Profile;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    socket.emit(ChatEvents.getUserRooms, { userId }, (rooms: Room[]) => {
      dispatch(addRooms(rooms));
    });
    socket.on(ChatEvents.userOnline, (userId: Participant["userId"]) => {
      dispatch(userJoined(userId));
    });
    socket.on(ChatEvents.userOffline, (userId: Participant["userId"]) => {
      dispatch(userLeft(userId));
    });
    socket.on(ChatEvents.newRoom, (newRoom: Room) => {
      dispatch(addRoom(newRoom));
    });

    return () => {
      socket.off(ChatEvents.getUserRooms);
      socket.off(ChatEvents.userOnline);
      socket.off(ChatEvents.userOffline);
      socket.off(ChatEvents.newRoom);
    };
  }, []);

  const handleToggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <List
        component="ul"
        subheader={
          <ListSubheader
            component="div"
            sx={{ backgroundColor: "transparent", color: "white", paddingX: 5 }}
            color="inherit"
          >
            {t("chat.contacts")}
          </ListSubheader>
        }
      >
        {newRoom && (
          <RoomItem
            name={newRoom.participants[0].name}
            selected
            isOnline={newRoom.participants[0].isOnline}
          />
        )}
        {rooms.length > 0 ? (
          <Box maxHeight={150} overflow="auto">
            {rooms.map((room) => (
              <RoomItem
                key={room.roomId}
                name={room.participants[0].name}
                selected={selectedRoom?.roomId === room.roomId}
                isOnline={room.participants[0].isOnline}
                unreadMessagesCount={room.unreadMessagesCount}
                deletable
                onSelect={() => onSelect(room.roomId)}
                onDelete={() => {
                  setDeleteRoom(room);
                  handleToggleModal();
                }}
              />
            ))}
          </Box>
        ) : (
          !newRoom && (
            <Typography variant="body2" sx={{ paddingX: 5, color: "white" }}>
              {t("chat.noRooms")}
            </Typography>
          )
        )}
      </List>
      <DeleteRoomDialog
        isOpen={isModalOpen}
        roomName={deleteRoom?.participants[0].name as string}
        onSubmit={() => {
          onDelete(deleteRoom!.roomId);
          handleToggleModal();
        }}
        onClose={handleToggleModal}
      />
    </>
  );
}

export default Rooms;
