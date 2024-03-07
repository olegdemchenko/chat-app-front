import React from "react";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { Box, Container, Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { Link } from "react-router-dom";

function VerificationSuccess() {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ display: "flex", alignItems: "center", height: "100vh" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <MarkEmailReadIcon sx={{ width: 70, height: 70, color: green[400] }} />
        <Typography variant="body1" sx={{ fontSize: 20, textAlign: "center" }}>
          Congratulations! Your email has been verified successfully!
        </Typography>
        <Typography variant="body1" sx={{ fontSize: 18 }}>
          <Link to="/chat">Start chatting right now!</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default VerificationSuccess;
