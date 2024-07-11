import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { grey, lightBlue } from "@mui/material/colors";
import { formatRelative } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Participant, Message } from "../../../types";
import ContactAvatar from "../../../components/ContactAvatar";

type MessageItem = {
  message: Message;
  participant?: Participant;
  onUpdateMessage: (
    messageId: Message["messageId"],
    newText: Message["text"],
  ) => void;
};

function MessageItem({ message, participant, onUpdateMessage }: MessageItem) {
  const isUserOwnMessage = !participant;
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>(message.text);

  const handleChangeText = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewText(e.target.value);
  };

  const handleToggleEdit = () => setIsEditable(!isEditable);

  const handleSubmit = () => {
    if (newText !== message.text && newText.length !== 0) {
      onUpdateMessage(message.messageId, newText);
    }
    handleToggleEdit();
  };

  const messageMaxWidth = 700;

  return (
    <Box display="flex" justifyContent={isUserOwnMessage ? "end" : "start"}>
      <Box
        maxWidth={messageMaxWidth}
        sx={{
          display: "grid",
          gridTemplateRows: "auto auto auto",
          gridTemplateColumns: "auto auto auto",
        }}
      >
        {!isUserOwnMessage && (
          <Box sx={{ gridRowStart: 2, gridColumnStart: 1, mr: 1 }}>
            <ContactAvatar isOnline={participant.isOnline} />
          </Box>
        )}
        <Typography variant="caption" sx={{ gridColumnStart: 2 }}>
          {formatRelative(message.lastModified, new Date())}
        </Typography>
        {isEditable ? (
          <OutlinedInput
            multiline
            value={newText}
            onChange={handleChangeText}
            autoFocus
            sx={{
              width: messageMaxWidth,
              flexDirection: "column",
              gridColumnStart: 2,
              gridRowStart: 2,
              borderRadius: 1,
            }}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{ paddingY: 2, alignSelf: "end" }}
              >
                <IconButton color="error" onClick={handleToggleEdit}>
                  <CloseIcon />
                </IconButton>
                <IconButton color="success" onClick={handleSubmit}>
                  <DoneIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              gridColumnStart: 2,
              gridRowStart: 2,
              paddingX: 2,
              paddingY: 1,
              borderRadius: 1,
              backgroundColor: isUserOwnMessage
                ? lightBlue["100"]
                : grey["100"],
            }}
          >
            {message.text}
          </Typography>
        )}
        {isUserOwnMessage && !isEditable && (
          <Box sx={{ gridColumnStart: 3, gridRowStart: 2 }}>
            <IconButton color="primary" onClick={handleToggleEdit}>
              <EditIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MessageItem;
