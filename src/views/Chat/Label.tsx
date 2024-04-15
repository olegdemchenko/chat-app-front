import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

function Label() {
  const { t } = useTranslation();
  return (
    <Typography
      component="h3"
      sx={{
        color: "#fff",
        fontSize: "2rem",
        fontWeight: "bold",
        textTransform: "uppercase",
      }}
    >
      {t("chat.label")}
    </Typography>
  );
}

export default Label;
