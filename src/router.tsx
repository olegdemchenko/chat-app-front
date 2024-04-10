import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login, { loginAction } from "./views/Login";
import Chat from "./views/Chat";
import ErrorPage from "./views/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp, { signupAction } from "./views/SignUp";
import VerifyEmail from "./views/VerifyEmail";
import VerificationSuccess from "./views/VerificationSuccess";

function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "login",
          action: loginAction,
          element: <Login />,
        },
        {
          path: "signup",
          action: signupAction,
          element: <SignUp />,
        },
        {
          path: "verify_email",
          element: <VerifyEmail />,
        },
        { path: "email_verify_success", element: <VerificationSuccess /> },
        {
          path: "chat",
          element: <Chat />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Router;
