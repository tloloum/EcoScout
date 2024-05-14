import React, { createContext, useState } from "react";

const AuthAdContext = createContext({
  isAuthenticatedAd: false,
  loginAd: () => {},
  signOutAd: () => {},
  setTokenAd: () => {},
  setUserIdAd: () => {},
  setAdherentId: () => {},
  getFirstNameAd: () => {},
  setFirstNameAd: () => {},
});

const AuthAdContextProvider = (props) => {
  const [isAuthenticatedAd, setIsAuthenticatedAd] = useState(false);
  const [myTokenAd, setMyTokenAd] = useState(null);
  const [myUserIdAd, setMyUserIdAd] = useState(null);
  const [myAdherentId, setMyAdherentId] = useState();
  const [myFirstNameAd, setMyFirstNameAd] = useState("");

  const setTokenAd = (token) => {
    setMyTokenAd(token);
  };

  const setUserIdAd = (userId) => {
    setMyUserIdAd(userId);
  };

  const setFirstNameAd = (firstNameAd) => {
    setMyFirstNameAd(firstNameAd);
  };

  const getFirstNameAd = () => {
    return myFirstNameAd;
  };

  const setAdherentId = (adherantId) => {
    setMyAdherentId(adherantId);
  };

  const loginAd = () => {
    setIsAuthenticatedAd(true);
  };

  const signOutAd = () => {
    setIsAuthenticatedAd(false);
  };

  return (
    <AuthAdContext.Provider
      value={{
        isAuthenticatedAd,
        loginAd,
        signOutAd,
        setTokenAd,
        setUserIdAd,
        setAdherentId,
        myTokenAd,
        myUserIdAd,
        myAdherentId,
        getFirstNameAd,
        setFirstNameAd,
      }}
    >
      {props.children}
    </AuthAdContext.Provider>
  );
};

export { AuthAdContext, AuthAdContextProvider };
