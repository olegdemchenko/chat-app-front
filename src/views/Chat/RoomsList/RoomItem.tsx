import React from "react";
import ListItemText from "@mui/material/ListItemText";
import { ListItem, Badge } from "@mui/material";
import cn from "classnames";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import IconButton from "@mui/material/IconButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ContactAvatar from "../../../components/ContactAvatar";

type RoomItemProps = {
  selected: boolean;
  name: string;
  isOnline: boolean;
  unreadMessagesCount?: number;
  deletable?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
};

function RoomItem({
  selected,
  name,
  isOnline,
  unreadMessagesCount = 0,
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
      <ListItemAvatar>
        <Badge
          badgeContent={unreadMessagesCount}
          color="success"
          invisible={unreadMessagesCount === 0}
        >
          <ContactAvatar isOnline={isOnline} />
        </Badge>
      </ListItemAvatar>
      <ListItemText primary={name} sx={{ color: "white" }} />
    </ListItem>
  );
}

export default RoomItem;
