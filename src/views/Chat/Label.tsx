import { Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

function Label() {
  const { t } = useTranslation();
  return (
    <Typography
      component="h4"
      sx={{
        padding: 5,
        paddingBottom: 0,
        color: "#fff",
        fontWeight: "bold",
        letterSpacing: "2px",
        textTransform: "uppercase",
      }}
    >
      {t("chat.label")}
    </Typography>
  );
}

export default Label;
