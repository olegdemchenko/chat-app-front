import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login";
import Chat from "./views/Chat";
import { authAPI } from "./services/auth";
import { store } from "./store";
import ErrorPage from "./views/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./views/SignUp";

const rootLoader = async () => {
  const { data, error } = await store.dispatch(
    authAPI.endpoints.identifyMe.initiate(),
  );
  return { data, error };
};

function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute />,
      loader: rootLoader,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "chat",
          element: <Chat />,
        },
        {
          path: "signup",
          element: <SignUp />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Router;
