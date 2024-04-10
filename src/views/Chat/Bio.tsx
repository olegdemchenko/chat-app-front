import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { selectCurrentUser } from "../../store/userSlice";
import { User } from "../../types";

function Bio() {
  const { name } = useSelector(selectCurrentUser) as User;
  return (
    <Box
      paddingBlock={8}
      paddingInline={4}
      textAlign="center"
      sx={{ backgroundColor: grey[200] }}
    >
      <Box component="div">
        <Typography variant="h5" gutterBottom fontWeight={700}>
          {name}
        </Typography>
        <CheckCircleIcon color="success" />
      </Box>
    </Box>
  );
}

export default Bio;
