import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login";
import Chat from "./views/Chat";
import ErrorPage from "./views/ErrorPage";
import ProtectedRoute, {
  protectedRootLoader,
} from "./components/ProtectedRoute";
import SignUp from "./views/SignUp";

function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute />,
      loader: protectedRootLoader,
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
