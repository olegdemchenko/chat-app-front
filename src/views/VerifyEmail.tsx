import React from "react";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import { Box, Container, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

function VerifyEmail() {
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
        <MarkEmailUnreadIcon sx={{ width: 70, height: 70, color: grey[300] }} />
        <Typography variant="body1" sx={{ fontSize: 20 }}>
          A letter with a verification link has been sent to your email address.
          Please, check your inbox.
        </Typography>
      </Box>
    </Container>
  );
}

export default VerifyEmail;
