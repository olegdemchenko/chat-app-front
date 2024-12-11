import React from "react";
import { Box, Container } from "@mui/material";

type CenteringContainerProps = {
  children: React.ReactNode;
};

function CenteringContainer({ children }: CenteringContainerProps) {
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
        }}
      >
        {children}
      </Box>
    </Container>
  );
}

export default CenteringContainer;
