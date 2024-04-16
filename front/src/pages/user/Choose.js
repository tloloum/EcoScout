import React from "react";
import ListOfAdherents from "../../components/ListOfAdherents";
import ListOfStructures from "../../components/ListOfStructures";

const Choose = () => {
  return (
    <div>
      <div className="choose-adherant">
        <h2>Choisissez un adhérent</h2>
        <ListOfAdherents buttonNew={true} />
      </div>
      <div className="choose-adherant">
        <h2>Choisissez une structure</h2>
        <ListOfStructures buttonNew={true} />
      </div>
    </div>
  );
};

export default Choose;
