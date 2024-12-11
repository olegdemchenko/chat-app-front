import React from "react";
import { Box, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

function JoinChatBanner() {
  const { t } = useTranslation();
  return (
    <Box component="div" sx={{ paddingX: 16 }}>
      <Alert severity="info" variant="filled">
        {t("chat.joinBackChat")}
      </Alert>
    </Box>
  );
}

export default JoinChatBanner;
