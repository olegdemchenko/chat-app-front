import React, { useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import { Room } from "types";
import DeleteRoomDialog from "./DeleteRoomDialog";
import RoomItem from "./Room";

type RoomsProps = {
  rooms: Room[];
  newRoom: Room | null;
  selectedRoom: Room | null;
  isLoading: boolean;
  onSelect: (roomId: Room["roomId"]) => void;
  onDelete: (roomId: Room["roomId"]) => void;
};

function Rooms({
  rooms,
  newRoom,
  selectedRoom,
  isLoading,
  onSelect,
  onDelete,
}: RoomsProps) {
  const { t } = useTranslation();
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleToggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      {isLoading ? (
        <Box
          display={"flex"}
          width="100%"
          padding={4}
          justifyContent={"center"}
        >
          <CircularProgress size={35} sx={{ color: "white" }} />
        </Box>
      ) : (
        <List
          component="ul"
          subheader={
            <ListSubheader
              component="div"
              sx={{
                backgroundColor: "transparent",
                color: "white",
                paddingX: 5,
              }}
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
      )}
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
