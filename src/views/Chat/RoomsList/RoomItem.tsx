import React from "react";
import ListItemText from "@mui/material/ListItemText";
import { ListItem } from "@mui/material";
import cn from "classnames";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import ContactAvatar from "./ContactAvatar";

type RoomItemProps = {
  selected: boolean;
  name: string;
  isOnline: boolean;
  deletable?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
};

function RoomItem({
  selected,
  name,
  isOnline,
  deletable = false,
  onSelect,
  onDelete,
}: RoomItemProps) {
  return (
    <ListItem
      sx={{
        paddingX: 5,
        "&:hover, &.selected": {
          backgroundColor: "primary.light",
        },
      }}
      className={cn({ selected })}
      onClick={onSelect}
      secondaryAction={
        deletable && (
          <IconButton sx={{ right: 5 }} onClick={onDelete}>
            <DeleteForeverIcon sx={{ color: "white" }} />
          </IconButton>
        )
      }
    >
      <ContactAvatar isOnline={isOnline} />
      <ListItemText primary={name} sx={{ color: "white" }} />
    </ListItem>
  );
}

export default RoomItem;
