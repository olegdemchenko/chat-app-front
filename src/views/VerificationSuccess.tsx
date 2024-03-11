import React from "react";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { Typography } from "@mui/material";
import { green } from "@mui/material/colors";
import { Link } from "react-router-dom";
import CenteringContainer from "../components/CenteringContainer";

function VerificationSuccess() {
  return (
    <CenteringContainer>
      <MarkEmailReadIcon sx={{ width: 70, height: 70, color: green[400] }} />
      <Typography variant="body1" sx={{ fontSize: 20, textAlign: "center" }}>
        Congratulations! Your email has been verified successfully!
      </Typography>
      <Typography variant="body1" sx={{ fontSize: 18 }}>
        <Link to="/chat">Start chatting right now!</Link>
      </Typography>
    </CenteringContainer>
  );
}

export default VerificationSuccess;
