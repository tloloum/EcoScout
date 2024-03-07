import React, { createContext, useState } from "react";

// export default React.createContext({
//   isAuthenticated: hasAuthenticated(),
// });

// import React, { createContext, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (profile_id, profile_password) => {
    console.log(profile_id, profile_password);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    console.log("signOut");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
