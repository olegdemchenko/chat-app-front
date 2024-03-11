import * as React from "react";
import MuiBackdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

type BackdropProps = {
  isOpen: boolean;
};

export default function Backdrop({ isOpen }: BackdropProps) {
  return (
    <MuiBackdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isOpen}
    >
      <CircularProgress color="inherit" />
    </MuiBackdrop>
  );
}
