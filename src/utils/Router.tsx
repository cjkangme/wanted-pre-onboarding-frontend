import React from "react";
import { Outlet, Navigate } from "react-router-dom";

export const PublicRouter: React.FC = () => {
  return !localStorage.getItem("token") ? (
    <Outlet />
  ) : (
    <Navigate to="/todo" replace={true} />
  );
};

export const PrivateRouter: React.FC = () => {
  return localStorage.getItem("token") ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace={true} />
  );
};
