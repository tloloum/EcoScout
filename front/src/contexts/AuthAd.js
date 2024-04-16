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
  const [myTokenAd, setMyTokenAd] = useState();
  const [myUserIdAd, setMyUserIdAd] = useState();
  const [myAdherentId, setMyAdherentId] = useState();
  const [myFirstNameAd, setMyFirstNameAd] = useState("");

  const setTokenAd = (token) => {
    console.log("My token Ad:", token);
    setMyTokenAd(token);
  };

  const setUserIdAd = (userId) => {
    console.log("My User ID Ad:", userId);
    setMyUserIdAd(userId);
  };

  const setFirstNameAd = (firstNameAd) => {
    console.log("My first name:", firstNameAd);
    setMyFirstNameAd(firstNameAd);
  };

  const getFirstNameAd = () => {
    return myFirstNameAd;
  };

  const setAdherentId = (adherantId) => {
    console.log("My Adherant ID:", adherantId);
    setMyAdherentId(adherantId);
  };

  const loginAd = () => {
    // console.log(myAdherentId, myUserIdAd, myTokenAd);
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
        getFirstNameAd,
        setFirstNameAd,
      }}
    >
      {props.children}
    </AuthAdContext.Provider>
  );
};

export { AuthAdContext, AuthAdContextProvider };
