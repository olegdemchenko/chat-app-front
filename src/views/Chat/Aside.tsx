import { Box } from "@mui/material";
import React from "react";
import Label from "./Label";
import Search from "./Search";

function Aside() {
  return (
    <Box
      component="aside"
      sx={{
        height: "100%",
        bgcolor: "primary.main",
        padding: 5,
      }}
    >
      <Label />
      <Search />
    </Box>
  );
}

export default Aside;
