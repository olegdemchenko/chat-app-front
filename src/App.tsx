import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Router from "./router";
import { useIdentifyMeQuery } from "./services/auth";
import Backdrop from "./components/Backdrop";

function App() {
  const { isFetching } = useIdentifyMeQuery();
  return (
    <>
      <CssBaseline />
      {isFetching ? <Backdrop isOpen /> : <Router />}
    </>
  );
}

export default App;
