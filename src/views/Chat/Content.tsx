import React from "react";
import { Box, Grid } from "@mui/material";
import Aside from "./Aside";

function Content() {
  return (
    <Box sx={{ height: "100vh" }}>
      <Grid container sx={{ height: "100%" }}>
        <Grid
          item
          md={4}
          sx={{
            height: "100%",
            borderRadius: "0 10px 10px 0",
            overflow: "hidden",
          }}
        >
          <Aside />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Content;
