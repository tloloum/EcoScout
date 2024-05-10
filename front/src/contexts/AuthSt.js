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
    console.log("My token Ad:", token);
    setMyTokenSt(token);
  };

  const setUserIdSt = (userId) => {
    console.log("My User ID St:", userId);
    setMyUserIdSt(userId);
  };

  const setNameSt = (nameSt) => {
    console.log("My name:", nameSt);
    setMyNameSt(nameSt);
  };

  const getNameSt = () => {
    return myNameSt;
  };

  const setDateSt = (dateSt) => {
    console.log("My date:", dateSt);
    setMyDateSt(dateSt);
  };

  const setStructureId = (adherantId) => {
    console.log("My Adherant ID:", adherantId);
    setMyStructureId(adherantId);
  };

  const loginSt = () => {
    console.log(myStructureId, myUserIdSt, myTokenSt);
    setIsAuthenticatedSt(true);
  };

  const signOutSt = () => {
    console.log("signOutSt");
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
        setNameSt,
        setDateSt,
      }}
    >
      {props.children}
    </AuthStContext.Provider>
  );
};

export { AuthStContext, AuthStContextProvider };
