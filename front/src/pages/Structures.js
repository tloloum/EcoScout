import React, { useContext } from "react";
import JoinStructure from "../components/JoinStructure";
import ListOfStructures from "../components/ListOfStructures";
import Navigation from "../components/Navigation";
import { AuthAdContext } from "../contexts/AuthAd";

const Structures = () => {
  const { isAuthenticated } = useContext(AuthAdContext);

  return (
    <div>
      <Navigation />
      <div className="structure">
        <h1>Structures</h1>
        <div className="structure-container">
          <div className="structure-top">
            {!isAuthenticated && <JoinStructure />}
          </div>
          <div className="structure-bot">
            <h2>Mes structures</h2>
            <ListOfStructures buttonNewStructure={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Structures;
