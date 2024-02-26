import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./contexts/Auth";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import { hasAuthenticated } from "./services/AuthApi";

// const TestProfile = ({ isAuthenticated }) => {
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   } else {
//     return <Navigate to="/profile" />;
//   }
// };

// const App = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());
//   return (
//     <Auth.Provider value={{ isAuthenticated }}>
//       <BrowserRouter>
//         <Routes>
//           <Route exact path="/" element={<Home />} />
//           <Route path="*" element={<Error404 />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />

//           <Route
//             path="/profile"
//             element={isAuthenticated ? <MyProfile /> : <Navigate to="/login" />}
//           />
//         </Routes>
//       </BrowserRouter>
//     </Auth.Provider>
//   );
// };

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(hasAuthenticated());

  return (
    <Auth.Provider value={{ isAuthenticated }}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="*" element={<Error404 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </Auth.Provider>
  );
};

export default App;
