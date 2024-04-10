import React from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useIdentifyMeQuery } from "../services/auth";
import Backdrop from "./Backdrop";

const notProtectedPaths = ["/login", "/signup", "/verify_email"];

function ProtectedRoute() {
  const { data, error, isFetching } = useIdentifyMeQuery();
  const queryError = error as FetchBaseQueryError;
  const { pathname } = useLocation();
  if (isFetching) {
    return <Backdrop isOpen />;
  }
  switch (true) {
    case queryError &&
      queryError.status === 400 &&
      notProtectedPaths.includes(pathname): {
      return <Outlet />;
    }
    case queryError &&
      queryError.status === 400 &&
      !notProtectedPaths.includes(pathname): {
      return <Navigate to="/login" />;
    }
    case data && pathname === "/": {
      return <Navigate to="/chat" />;
    }
    default:
      return <Outlet />;
  }
}

export default ProtectedRoute;
