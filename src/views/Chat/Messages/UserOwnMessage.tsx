import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { formatRelative } from "date-fns";
import { lightBlue } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Message } from "../../../types";

type UserOwnMessageProps = {
  message: Message;
  onUpdateMessage: (
    messageId: Message["messageId"],
    newText: Message["text"],
  ) => void;
  onDeleteMessage: (messageId: Message["messageId"]) => void;
};

function UserOwnMessage({
  message,
  onUpdateMessage,
  onDeleteMessage,
}: UserOwnMessageProps) {
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

  const handleDelete = () => {
    onDeleteMessage(message.messageId);
  };
  const messageMaxWidth = 700;

  return (
    <Box display="flex" justifyContent="end">
      <Box
        maxWidth={messageMaxWidth}
        sx={{
          display: "grid",
          gridTemplateRows: "auto auto auto",
          gridTemplateColumns: "auto auto auto",
        }}
      >
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
              backgroundColor: lightBlue["100"],
            }}
          >
            {message.text}
          </Typography>
        )}
        {!isEditable && (
          <Box sx={{ gridColumnStart: 3, gridRowStart: 2 }}>
            <IconButton color="primary" onClick={handleToggleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={handleDelete}>
              <DeleteOutlineIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default UserOwnMessage;
