import React from "react";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { formatRelative } from "date-fns";
import { Message, Participant } from "../../../types";
import ContactAvatar from "../../../components/ContactAvatar";

type ParticipantMessageProps = {
  message: Message;
  author: Participant;
};

function ParticipantMessage({ message, author }: ParticipantMessageProps) {
  const messageMaxWidth = 700;
  return (
    <Box display="flex" justifyContent="start">
      <Box
        maxWidth={messageMaxWidth}
        sx={{
          display: "grid",
          gridTemplateRows: "auto auto auto",
          gridTemplateColumns: "auto auto auto",
        }}
      >
        <Box sx={{ gridRowStart: 2, gridColumnStart: 1, mr: 1 }}>
          <ContactAvatar isOnline={author!.isOnline} />
        </Box>
        <Typography variant="caption" sx={{ gridColumnStart: 2 }}>
          {formatRelative(message.lastModified, new Date())}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            gridColumnStart: 2,
            gridRowStart: 2,
            paddingX: 2,
            paddingY: 1,
            borderRadius: 1,
            backgroundColor: grey["100"],
          }}
        >
          {message.text}
        </Typography>
      </Box>
    </Box>
  );
}

export default ParticipantMessage;
