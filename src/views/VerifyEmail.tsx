import React from "react";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import { Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useTranslation } from "react-i18next";
import CenteringContainer from "../components/CenteringContainer";

function VerifyEmail() {
  const { t } = useTranslation();
  return (
    <CenteringContainer>
      <MarkEmailUnreadIcon sx={{ width: 70, height: 70, color: grey[300] }} />
      <Typography variant="body1" sx={{ fontSize: 20 }}>
        {t("auth.verificationLetterSent")}
      </Typography>
    </CenteringContainer>
  );
}

export default VerifyEmail;
