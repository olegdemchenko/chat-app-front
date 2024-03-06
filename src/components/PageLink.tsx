import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

import Grid from "@mui/material/Grid";

type PageLinkProps = {
  href: string;
  text: string;
};

function PageLink({ href, text }: PageLinkProps) {
  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Link to={href}>
          <Typography variant="body1" sx={{ color: "primary.dark" }}>
            {text}
          </Typography>
        </Link>
      </Grid>
    </Grid>
  );
}

export default PageLink;
