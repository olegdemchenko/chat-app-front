import React from "react";
import { Box, Grid } from "@mui/material";
import Bio from "./Bio";

function Content() {
  return (
    <Box sx={{ height: "100vh" }}>
      <Grid container spacing={0}>
        <Grid item lg={3}>
          <Bio />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Content;
