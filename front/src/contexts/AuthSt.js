import React, { createContext, useState } from "react";

const AuthStContext = createContext({
  isAuthenticatedSt: false,
  loginSt: () => {},
  signOutSt: () => {},
  setTokenSt: () => {},
  setUserIdSt: () => {},
  setStructureId: () => {},
  getNameSt: () => {},
  setNameSt: () => {},
  setDateSt: () => {},
});

const AuthStContextProvider = (props) => {
  const [isAuthenticatedSt, setIsAuthenticatedSt] = useState(false);
  const [myTokenSt, setMyTokenSt] = useState("");
  const [myUserIdSt, setMyUserIdSt] = useState(null);
  const [myStructureId, setMyStructureId] = useState(null);
  const [myNameSt, setMyNameSt] = useState("");
  const [myDateSt, setMyDateSt] = useState("");

  const setTokenSt = (token) => {
    setMyTokenSt(token);
  };

  const setUserIdSt = (userId) => {
    setMyUserIdSt(userId);
  };

  const setNameSt = (nameSt) => {
    setMyNameSt(nameSt);
  };

  const getNameSt = () => {
    return myNameSt;
  };

  const setDateSt = (dateSt) => {
    setMyDateSt(dateSt);
  };

  const setStructureId = (adherantId) => {
    setMyStructureId(adherantId);
  };

  const loginSt = () => {
    setIsAuthenticatedSt(true);
  };

  const signOutSt = () => {
    setIsAuthenticatedSt(false);
  };

  return (
    <AuthStContext.Provider
      value={{
        isAuthenticatedSt,
        loginSt,
        signOutSt,
        setTokenSt,
        setUserIdSt,
        setStructureId,
        myDateSt,
        myTokenSt,
        myUserIdSt,
        myStructureId,
        getNameSt,
        myNameSt,
        setNameSt,
        setDateSt,
      }}
    >
      {props.children}
    </AuthStContext.Provider>
  );
};

export { AuthStContext, AuthStContextProvider };
