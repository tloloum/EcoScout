import React, { useContext } from "react";
import { Navigate, Route } from "react-router-dom";
import Auth from "../contexts/Auth";

const AutheticatedRoute = ({ path, component }) => {
  const { isAuthenticated } = useContext(Auth);
  return isAuthenticated ? (
    <Route exact path={path} component={component} />
  ) : (
    <Navigate to="/login" />
  );
};

export default AutheticatedRoute;
