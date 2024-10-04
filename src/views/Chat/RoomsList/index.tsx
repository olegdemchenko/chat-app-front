import React, { useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Room } from "../../../types";
import DeleteRoomDialog from "./DeleteRoomDialog";
import RoomItem from "./RoomItem";

type RoomsListProps = {
  rooms: Room[];
  newRoom: Room | null;
  selectedRoom: Room | null;
  onSelect: (roomId: Room["roomId"]) => void;
  onDelete: (roomId: Room["roomId"]) => void;
};

function RoomsList({
  rooms,
  newRoom,
  selectedRoom,
  onSelect,
  onDelete,
}: RoomsListProps) {
  const { t } = useTranslation();
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
          <>
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
          </>
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

export default RoomsList;
