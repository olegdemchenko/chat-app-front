import React from "react";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CenteringContainer from "../components/CenteringContainer";

function VerificationSuccess() {
  const { t } = useTranslation();

  return (
    <CenteringContainer>
      <MarkEmailReadIcon sx={{ width: 70, height: 70, color: green[400] }} />
      <Typography variant="body1" sx={{ fontSize: 20, textAlign: "center" }}>
        {t("auth.emailVerificationSuccess")}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: 18 }}>
        <Link to="/chat">{t("auth.chatLink")}</Link>
      </Typography>
    </CenteringContainer>
  );
}

export default VerificationSuccess;
