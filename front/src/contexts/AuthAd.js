import React, { createContext, useState } from "react";

const AuthAdContext = createContext({
  isAuthenticatedAd: false,
  loginAd: () => {},
  signOutAd: () => {},
  setTokenAd: () => {},
  setUserIdAd: () => {},
  setAdherantId: () => {},
});

const AuthAdContextProvider = (props) => {
  const [isAuthenticatedAd, setIsAuthenticatedAd] = useState(false);
  const [myTokenAd, setMyTokenAd] = useState(false);
  const [myUserIdAd, setMyUserIdAd] = useState(false);
  const [myAdherentId, setMyAdherentId] = useState(false);

  const setTokenAd = (token) => {
    console.log("My token Ad:", token);
    setMyTokenAd(token);
  };

  const setUserIdAd = (userId) => {
    console.log("My User ID Ad:", userId);
    setMyUserIdAd(userId);
  };

  const setAdherentId = (adherantId) => {
    console.log("My Adherant ID:", adherantId);
    setMyAdherentId(adherantId);
  };

  const loginAd = (profile_id, profile_password) => {
    console.log(profile_id, profile_password);
    setIsAuthenticatedAd(true);
  };

  const signOutAd = () => {
    console.log("signOutAd");
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
      }}
    >
      {props.children}
    </AuthAdContext.Provider>
  );
};

export { AuthAdContext, AuthAdContextProvider };