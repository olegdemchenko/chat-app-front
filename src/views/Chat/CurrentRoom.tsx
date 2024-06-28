import React from "react";
import { Grid } from "@mui/material";
import { Room } from "../../types";

type CurrentRoomProps = {
  room: Room | null;
};

function CurrentRoom({ room }: CurrentRoomProps) {
  return (
    <Grid
      item
      md={9}
      sx={{
        height: "100%",
      }}
    >
      Message block
    </Grid>
  );
}

export default CurrentRoom;
