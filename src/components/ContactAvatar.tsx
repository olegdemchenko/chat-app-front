import React from "react";
import { Avatar, Badge } from "@mui/material";

type ContactAvatarProps = {
  isOnline: boolean;
};

function ContactAvatar({ isOnline }: ContactAvatarProps) {
  return (
    <Badge
      badgeContent
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      overlap="circular"
      color={isOnline ? "success" : "error"}
    >
      <Avatar />
    </Badge>
  );
}

export default ContactAvatar;
