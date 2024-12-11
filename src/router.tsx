import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login";
import ErrorPage from "./views/ErrorPage";
import SignUp from "./views/SignUp";
import VerifyEmail from "./views/VerifyEmail";
import VerificationSuccess from "./views/VerificationSuccess";
import ProtectedRoute from "./components/ProtectedRoute";
import { routes } from "./constants";
import SocketProvider from "./views/SocketProvider";

function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <SocketProvider />
            </ProtectedRoute>
          ),
        },
        {
          path: routes.login,
          element: <Login />,
        },
        {
          path: routes.signup,
          element: <SignUp />,
        },
        {
          path: routes.verifyEmail,
          element: <VerifyEmail />,
        },
        { path: routes.verificationSuccess, element: <VerificationSuccess /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Router;
