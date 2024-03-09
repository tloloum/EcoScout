// import React, { useContext } from "react";
// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { AuthContext, AuthContextProvider } from "./contexts/Auth";
// import Error404 from "./pages/Error404";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Profile from "./pages/Profile";
// import Register from "./pages/Register";

// const App = () => {
//   return (
//     <AuthContextProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route exact path="/" element={<Home />} />
//           <Route path="*" element={<Error404 />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route
//             path="/profile"
//             element={<PrivateRoute component={<Profile />} />}
//           />
//         </Routes>
//       </BrowserRouter>
//     </AuthContextProvider>
//   );
// };

// const PrivateRoute = ({ component }) => {
//   // Accessing isAuthenticated from the context
//   const { isAuthenticated } = useContext(AuthContext);

//   // Redirect to login if not authenticated
//   return isAuthenticated ? component : <Navigate to="/login" />;
// };

// export default App;
import React, { useContext, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Head";
import Sidebar from "./components/Sidebar";
import { AuthContext, AuthContextProvider } from "./contexts/Auth";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const structures = [
    { id: 1, name: "Structure 1" },
    { id: 2, name: "Structure 2" },
    { id: 3, name: "Structure 3" },
  ];

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Header />
        {}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          structures={structures}
        />

        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="*" element={<Error404 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={<PrivateRoute component={<Profile />} />}
          />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

const PrivateRoute = ({ component }) => {
  // Accessing isAuthenticated from the context
  const { isAuthenticated } = useContext(AuthContext);

  // Redirect to login if not authenticated
  return isAuthenticated ? component : <Navigate to="/login" />;
};

export default App;
