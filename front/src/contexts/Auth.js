import React, { createContext, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [myToken, setMyToken] = useState(false);
  const [myUserId, setMyUserId] = useState(false);

  const setToken = (token) => {
    console.log("My token :", token);
    setMyToken(token);
  };

  const setUserId = (userId) => {
    console.log("My User ID :", userId);
    setMyUserId(userId);
  };

  const login = (profile_id, profile_password) => {
    console.log(profile_id, profile_password);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    console.log("signOut");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, signOut, setToken, setUserId }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
