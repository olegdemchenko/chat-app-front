import React from "react";
import { useRouteError } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import { red } from "@mui/material/colors";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import CenteringContainer from "../components/CenteringContainer";

function ErrorPage() {
  const error = useRouteError() as Error;
  const { t } = useTranslation();

  return (
    <CenteringContainer>
      <ErrorIcon sx={{ width: 70, height: 70, color: red["800"] }} />
      <Typography
        variant="body1"
        sx={{
          color: red["800"],
        }}
      >
        {t("auth.errorPageText", { error: error.message })}
      </Typography>
    </CenteringContainer>
  );
}

export default ErrorPage;
