import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import illustration from "../../../assets/img/chat-illustration.svg";

function StartChatting() {
  const { t } = useTranslation();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
    >
      <Box component="div" textAlign="center">
        <img
          src={illustration}
          alt="chat picture"
          style={{ width: 300, height: 300 }}
        />

        <Typography variant="h6">{t("chat.startNewConversation")}</Typography>
        <Typography variant="subtitle2">{t("chat.typeMessage")}</Typography>
      </Box>
    </Box>
  );
}

export default StartChatting;
