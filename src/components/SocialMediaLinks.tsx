import React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Grid, Link } from "@mui/material";

function SocialMediaLinks() {
  return (
    <Grid container justifyContent="center" gap={3} sx={{ mt: 2 }}>
      <Grid item>
        <Link href="/api/auth/facebook">
          <FacebookIcon color="primary" sx={{ fontSize: 45 }} />
        </Link>
      </Grid>
      <Grid item>
        <Link href="/api/auth/google">
          <GoogleIcon color="error" sx={{ fontSize: 45 }} />
        </Link>
      </Grid>
    </Grid>
  );
}

export default SocialMediaLinks;
