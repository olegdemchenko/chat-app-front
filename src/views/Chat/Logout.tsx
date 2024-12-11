import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLogoutMutation } from "../../services/auth";

function Logout() {
  const [logout, { data, isLoading }] = useLogoutMutation();
  const { t } = useTranslation();

  if (data?.status) {
    return <Navigate to="/login" />;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", paddingBottom: 5 }}>
      <Button
        color="error"
        startIcon={<ArrowBackIcon />}
        size="large"
        variant="contained"
        disabled={isLoading}
        onClick={() => logout()}
      >
        {t("chat.logout")}
      </Button>
    </Box>
  );
}

export default Logout;
