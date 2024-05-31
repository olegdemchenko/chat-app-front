import React from "react";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Grid, Link } from "@mui/material";

function SocialMediaLinks() {
  return (
    // TODO add links after the auth functionality via social networks is done
    <Grid container justifyContent="center" gap={3} sx={{ mt: 2 }}>
      <Grid item>
        <Link href="/">
          <FacebookIcon color="primary" sx={{ fontSize: 45 }} />
        </Link>
      </Grid>
      <Grid item>
        <Link href="/">
          <GoogleIcon color="error" sx={{ fontSize: 45 }} />
        </Link>
      </Grid>
    </Grid>
  );
}

export default SocialMediaLinks;
