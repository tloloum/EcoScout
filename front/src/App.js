// import React, { useContext } from "react";
import React, { useContext, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Head";
import Sidebar from "./components/Sidebar";

import { AuthContext, AuthContextProvider } from "./contexts/Auth";
import { AuthAdContextProvider } from "./contexts/AuthAd";
import { AuthStContextProvider } from "./contexts/AuthSt";
import { ServerContextProvider } from "./contexts/Server";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Structures from "./pages/Structures";
import Choose from "./pages/user/Choose";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import RegisterAdherent from "./pages/user/RegisterAdherent";
import RegisterStructure from "./pages/user/RegisterStructure";
import Welcome from "./pages/user/Welcome";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const structures = [
    { id: 1, name: "Structure 1" },
    { id: 2, name: "Structure 2" },
    { id: 3, name: "Structure 3" },
  ];

  const { isAuthenticated } = useContext(AuthContext);

  const closeSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ServerContextProvider>
      <AuthContextProvider>
        <AuthAdContextProvider>
          <AuthStContextProvider>
            <BrowserRouter>
              <Header isAuthenticated={isAuthenticated} />
              {}
              <Sidebar
                isAuthenticated={isAuthenticated}
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                structures={structures}
              />

              <Routes>
                <Route exact path="/" element={<Welcome />} />
                <Route path="*" element={<Error404 />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />

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
                <Route
                  path="/profile"
                  element={<PrivateRoute component={<Profile />} />}
                />
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
