// import React, { useContext } from "react";
import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Head";
import Sidebar from "./components/Sidebar";

import { AuthContext, AuthContextProvider } from "./contexts/Auth";
import { AuthAdContext, AuthAdContextProvider } from "./contexts/AuthAd";
import { AuthStContextProvider } from "./contexts/AuthSt";
import { ServerContextProvider } from "./contexts/Server";
import Error404 from "./pages/Error404";
import HomeAd from "./pages/HomeAd";
import Profile from "./pages/Profile";
import Structures from "./pages/Structures";
import Choose from "./pages/user/Choose";
import Login from "./pages/user/Login";
import ChooseAccountType from "./pages/user/ChooseAccountType";
import Register from "./pages/user/Register";
import RegisterAdherent from "./pages/user/RegisterAdherent";
import RegisterStructure from "./pages/user/RegisterStructure";
import Welcome from "./pages/user/Welcome";
import { RiTreasureMapFill } from "react-icons/ri";
import HomeStruct from "./pages/HomeStruct";
import JoinStructAd from "./pages/JoinStructAd";

const App = () => {
  const { isAuthenticatedAd } = useContext(AuthAdContext);

  return (
    <ServerContextProvider>
      <AuthContextProvider>
        <AuthAdContextProvider>
          <AuthStContextProvider>
            <BrowserRouter>
              <Header isAuthenticated={isAuthenticatedAd} />

              <Routes>
                <Route exact path="/" element={<Welcome />} />
                <Route path="*" element={<Error404 />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chooseAccountType" element={<ChooseAccountType />} />
                <Route path="/homead" element={<HomeAd />} />
                <Route path="/homestruct" element={<HomeStruct />} />
                <Route path="/join" element={<JoinStructAd />} />
                <Route
                  path="/choose"
                  element={<PrivateRoute component={<Choose />} />}
                />
                <Route
                  path="/registerAdherent"
                  element={<PrivateRoute component={<RegisterAdherent />} />}
                />
                <Route
                  path="/registerStructure"
                  element={<PrivateRoute component={<RegisterStructure />} />}
                />
                <Route
                  path="/structures"
                  element={<PrivateRoute component={<Structures />} />}
                />
                {/*################################*/}
                {/*A enlever une fois que le bug de modification de profil sera terminé */}
                <Route path="/profile" element={<Profile />} />{" "}
                {/*Forme normale*/}
                {/* <Route
                  path="/profile"
                  element={<PrivateRoute component={<Profile />} />}
                /> */}
                {/*################################*/}
              </Routes>
            </BrowserRouter>
          </AuthStContextProvider>
        </AuthAdContextProvider>
      </AuthContextProvider>
    </ServerContextProvider>
  );
};

const PrivateRoute = ({ component }) => {
  // Accessing isAuthenticated from the context
  const { isAuthenticated } = useContext(AuthContext);

  // Redirect to login if not authenticated
  return isAuthenticated ? component : <Navigate to="/login" />;
};

export default App;
