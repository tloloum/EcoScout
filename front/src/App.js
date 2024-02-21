import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";
import Profil from "./pages/Profil";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
