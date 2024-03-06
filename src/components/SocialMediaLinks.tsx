import React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Grid } from "@mui/material";

function SocialMediaLinks() {
  return (
    <Grid container justifyContent="center" gap={3} sx={{ mt: 2 }}>
      <Grid item>
        <FacebookIcon color="primary" sx={{ fontSize: 45 }} />
      </Grid>
      <Grid item>
        <GoogleIcon color="error" sx={{ fontSize: 45 }} />
      </Grid>
    </Grid>
  );
}

export default SocialMediaLinks;
