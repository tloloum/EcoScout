import React, { createContext, useState } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  signOut: () => {},
  setToken: () => {},
  setUserId: () => {},
});

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [myToken, setMyToken] = useState();
  const [myUserId, setMyUserId] = useState();

  const setToken = (token) => {
    setMyToken(token);
    console.log("My token :", token);
  };

  const setUserId = (userId) => {
    setMyUserId(userId);
    console.log("My User ID :", userId);
  };

  const login = (profile_id, profile_password) => {
    // console.log(profile_id, profile_password);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    console.log("signOut");

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        signOut,
        setToken,
        setUserId,
        myToken,
        myUserId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
