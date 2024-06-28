import React from "react";
import { ListItemAvatar } from "@mui/material";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

type ContactAvatarProps = {
  isOnline: boolean;
};

const statusIconStyles = {
  position: "absolute",
  bottom: "-5px",
  right: "-5px",
  backgroundColor: "white",
  clipPath: "circle(35% at 50% 50%)",
};

function ContactAvatar({ isOnline }: ContactAvatarProps) {
  return (
    <ListItemAvatar>
      <Avatar sx={{ overflow: "visible" }}>
        <AccountCircleIcon />
        {isOnline ? (
          <CheckCircleIcon
            sx={statusIconStyles}
            fontSize="small"
            color="success"
          />
        ) : (
          <RemoveCircleIcon
            sx={statusIconStyles}
            fontSize="small"
            color="error"
          />
        )}
      </Avatar>
    </ListItemAvatar>
  );
}

export default ContactAvatar;
