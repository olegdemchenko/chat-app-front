import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { routes } from "../../constants";

function Logout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate(routes.login);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", paddingBottom: 5 }}>
      <Button
        color="error"
        startIcon={<ArrowBackIcon />}
        size="large"
        variant="contained"
        onClick={handleLogout}
      >
        {t("chat.logout")}
      </Button>
    </Box>
  );
}

export default Logout;
