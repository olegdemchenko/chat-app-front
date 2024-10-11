import React from "react";
import { Box, Grid } from "@mui/material";

type AsideProps = {
  children: React.ReactNode;
};

function Aside({ children }: AsideProps) {
  return (
    <Grid
      item
      md={3}
      sx={{
        height: "100%",
        borderRadius: "0 10px 10px 0",
        overflow: "hidden",
      }}
    >
      <Box
        component="aside"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          bgcolor: "primary.main",
        }}
      >
        {children}
      </Box>
    </Grid>
  );
}

export default Aside;
