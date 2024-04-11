import React, { useContext } from "react";
import Create from "../components/Create";
import Navigation from "../components/Navigation";
import { AuthAdContext } from "../contexts/AuthAd";

const Structures = () => {
  const { isAuthenticated } = useContext(AuthAdContext);

  return (
    <div>
      <Navigation />
      <h1>Structures</h1>
      {!isAuthenticated && <Create />}
    </div>
  );
};

export default Structures;
