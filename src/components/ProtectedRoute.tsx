import React from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useLoaderData, Outlet, Navigate, useLocation } from "react-router-dom";
import type { UserAuthData } from "../types";

const notProtectedPaths = ["/login", "/signup"];

function ProtectedRoute() {
  const { data, error } = useLoaderData() as {
    data: UserAuthData | undefined;
    error: FetchBaseQueryError | undefined;
  };
  const { pathname } = useLocation();
  switch (true) {
    case error &&
      error.status === 400 &&
      notProtectedPaths.includes(pathname): {
      return <Outlet />;
    }
    case error &&
      error.status === 400 &&
      !notProtectedPaths.includes(pathname): {
      return <Navigate to="/login" />;
    }
    default:
      return <Outlet />;
  }
}

export default ProtectedRoute;
