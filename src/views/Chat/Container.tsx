import React from "react";
import { Box, Grid } from "@mui/material";

type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  return (
    <Box sx={{ height: "100vh" }}>
      <Grid container sx={{ height: "100%" }}>
        {children}
      </Grid>
    </Box>
  );
}

export default Container;
