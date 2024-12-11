import { Box, Typography } from "@mui/material";
import { formatRelative } from "date-fns";
import { Message } from "../../../types";

type SystemMessageProps = {
  message: Message;
};

function SystemMessage({ message }: SystemMessageProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" py={2}>
      <Typography variant="caption" sx={{ gridColumnStart: 2 }}>
        {formatRelative(message.createdAt, new Date())}
      </Typography>
      <Typography variant="body2">{message.text}</Typography>
    </Box>
  );
}

export default SystemMessage;
