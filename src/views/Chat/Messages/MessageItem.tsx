import React from "react";
import { Box, Typography } from "@mui/material";
import { grey, lightBlue } from "@mui/material/colors";
import { formatRelative } from "date-fns";
import { Participant, Message } from "../../../types";
import ContactAvatar from "../../../components/ContactAvatar";

type MessageItem = {
  message: Message;
  participant?: Participant;
};

function MessageItem({ message, participant }: MessageItem) {
  const isUserOwnMessage = !participant;
  return (
    <Box display="flex" justifyContent={isUserOwnMessage ? "end" : "start"}>
      <Box
        maxWidth={500}
        sx={{
          display: "grid",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "auto auto",
        }}
      >
        {participant && (
          <Box sx={{ gridRowStart: 2, gridColumnStart: 1, mr: 1 }}>
            <ContactAvatar isOnline={participant.isOnline} />
          </Box>
        )}
        <Typography variant="caption" sx={{ gridColumnStart: 2 }}>
          {formatRelative(message.createdAt, new Date())}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            gridColumnStart: 2,
            gridRowStart: 2,
            paddingX: 2,
            paddingY: 1,
            borderRadius: 1,
            backgroundColor: isUserOwnMessage ? lightBlue["100"] : grey["100"],
          }}
        >
          {message.text}
        </Typography>
      </Box>
    </Box>
  );
}

export default MessageItem;
