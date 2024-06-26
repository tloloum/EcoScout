// import React, { useContext } from "react";
import React, { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthContext, AuthContextProvider } from "./contexts/Auth";
import { AuthAdContext, AuthAdContextProvider } from "./contexts/AuthAd";
import { AuthStContextProvider } from "./contexts/AuthSt";
import { ServerContextProvider } from "./contexts/Server";
import Error404 from "./pages/Error404";
import HomeAd from "./pages/adherent/HomeAd";

import AddEvent from "./pages/events/AddEvent";
import AddImpactPage from "./pages/impacts/AddImpactPage";
import HomeStructAd from "./pages/structures/structAd/HomeStructAd";
import ChooseAccountType from "./pages/user/ChooseAccountType";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import RegisterAdherent from "./pages/adherent/RegisterAdherent";
import RegisterStructure from "./pages/structures/RegisterStructure";

import Badges from "./pages/Badges/Badges";
import HomeStruct from "./pages/structures/HomeStruct";
import JoinStructAd from "./pages/structures/structAd/JoinStructAd";
import JoinHierarchy from "./pages/structures/JoinHierarchy";
import SeeDemands from "./pages/structures/SeeDemands";
import Welcome from "./pages/user/Welcome";
import ListAdStruct from "./pages/structures/structAd/ListAdStruct";

const App = () => {
  const { isAuthenticatedAd } = useContext(AuthAdContext);

  return (
    <ServerContextProvider>
      <AuthContextProvider>
        <AuthAdContextProvider>
          <AuthStContextProvider>
            <BrowserRouter>

              <Routes>
                <Route exact path="/" element={<Welcome />} />
                <Route path="*" element={<Error404 />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/chooseAccountType"
                  element={<ChooseAccountType />}
                />
                <Route
                  path="/homead"
                  element={<PrivateRoute component={<HomeAd />} />}
                />
                <Route
                  path="/homeStructAd/:name"
                  element={<PrivateRoute component={<HomeStructAd />} />}
                />
                <Route
                  path="/homeStruct/:name"
                  element={<PrivateRoute component={<HomeStruct />} />}
                />
                <Route
                  path="/join"
                  element={<PrivateRoute component={<JoinStructAd />} />}
                />
                <Route
                  path="/hierarchy"
                  element={<PrivateRoute component={<JoinHierarchy />} />}
                />
                <Route
                  path="/demands"
                  element={<PrivateRoute component={<SeeDemands />} />}
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
                  path="/addImpact/:structName"
                  element={<PrivateRoute component={<AddImpactPage />} />}
                />

                <Route
                  path="/addEvent/:structName"
                  element={<PrivateRoute component={<AddEvent />} />}
                />

                <Route
                  path="/membersList"
                  element={<PrivateRoute component={<ListAdStruct />} />}
                />

                <Route
                  path="/badges"
                  element={<PrivateRoute component={<Badges />} />}
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
