import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { Participant } from "../../../types";
import ContactAvatar from "../../../components/ContactAvatar";

type HeaderProps = {
  participants: Participant[];
};

function Header({ participants }: HeaderProps) {
  return (
    <Paper square sx={{ px: 3, py: 2 }}>
      {participants.map((participant, index) => (
        <Box display="flex" alignItems="center" key={participant.userId}>
          <ContactAvatar isOnline={participant.isOnline} />
          <Typography variant="h6" fontWeight="bold" ml={1.5}>
            {participant.name}
            {index === participants.length - 1 ? "" : ","}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

export default Header;
