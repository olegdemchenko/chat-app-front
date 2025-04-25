import React, { useState, useEffect, useRef } from "react";
import { Box, Paper, InputBase, Divider, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTranslation } from "react-i18next";

type InputProps = {
  disabled: boolean;
  onSubmit: (text: string) => void;
};

function Input({ disabled, onSubmit }: InputProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !disabled) {
      console.log("focus");
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => setMessage(e.target.value);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (message.length > 0) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(message);
    setMessage("");
  };

  return (
    <Box component="div" sx={{ paddingX: 16, paddingY: 4 }}>
      <Paper component="form" sx={{ display: "flex", alignItems: "center" }}>
        <InputBase
          inputRef={inputRef}
          placeholder={t("chat.inputPlaceholder")}
          onChange={handleChange}
          value={message}
          onKeyDown={handleKeyDown}
          sx={{ padding: 2, flexGrow: 1 }}
          disabled={disabled}
          autoFocus
        />
        <Divider sx={{ height: 34, ml: 1 }} orientation="vertical" />
        <IconButton
          onClick={handleSubmit}
          color="primary"
          sx={{ ml: 1, mr: 0.8 }}
          disabled={disabled}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}

export default Input;
