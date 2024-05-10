// import React, { useContext } from "react";
import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Head";

import { AuthContext, AuthContextProvider } from "./contexts/Auth";
import { AuthAdContext, AuthAdContextProvider } from "./contexts/AuthAd";
import { AuthStContextProvider } from "./contexts/AuthSt";
import { ServerContextProvider } from "./contexts/Server";
import Error404 from "./pages/Error404";
import Events from "./pages/Events";
import HomeAd from "./pages/HomeAd";
// import Profile from "./pages/Profile";
import Structures from "./pages/Structures";

import Choose from "./pages/user/Choose";
import ChooseAccountType from "./pages/user/ChooseAccountType";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import RegisterAdherent from "./pages/user/RegisterAdherent";
import RegisterEvent from "./pages/user/RegisterEvent";
import RegisterStructure from "./pages/user/RegisterStructure";
import HomeStructAd from "./pages/HomeStructAd";
import Impact from "./pages/user/Impact";
import AddImpact from "./pages/AddImpact";
import AddEvent from "./pages/AddEvent";

import HomeStruct from "./pages/HomeStruct";
import JoinStructAd from "./pages/JoinStructAd";
import JoinHierarchy from "./pages/JoinHierarchy";
import SeeDemands from "./pages/SeeDemands";
import Welcome from "./pages/user/Welcome";

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
                <Route
                  path="/chooseAccountType"
                  element={<ChooseAccountType />}
                />
                <Route path="/homead" element={<HomeAd />} />
                <Route path="/homestruct" element={<HomeStruct />} />
                <Route path="/homeStruct/:name" element={<PrivateRoute component={<HomeStructAd />} />} />
                <Route path="/join" element={<JoinStructAd />} />
                <Route path="/hierarchy" element={<JoinHierarchy />} />
                <Route path="/demands" element={<SeeDemands />} />
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
                  path="/registerEvent"
                  element={<PrivateRoute component={<RegisterEvent />} />}
                />
                <Route
                  path="/structures"
                  element={<PrivateRoute component={<Structures />} />}
                />
                <Route
                  path="/evenements"
                  element={<PrivateRoute component={<Events />} />}
                />

                <Route
                  path="/addImpact/:structName"
                  element={<PrivateRoute component={<AddImpact />} />}
                />

                <Route
                  path="/addEvent"
                  element={<PrivateRoute component={<AddEvent />} />}
                />
                {/*################################*/}
                {/*A enlever une fois que le bug de modification de profil sera terminé */}
                {/* <Route path="/profile" element={<Profile />} />{" "} */}
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
