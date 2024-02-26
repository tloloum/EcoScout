import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./contexts/Auth";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import { hasAuthenticated } from "./services/AuthApi";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());
  return (
    <Auth.Provider value={{ isAuthenticated }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Error404 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </Auth.Provider>
  );
};

export default App;
