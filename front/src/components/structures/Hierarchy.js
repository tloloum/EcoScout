import React, { useContext, useEffect, useState } from "react";
import SearchStruct from "./SearchStruct";
import { AuthStContext } from "../../contexts/AuthSt";
import { ServerContext } from "../../contexts/Server";

const Hierarchy = () => {
  const { getServerAddress } = useContext(ServerContext);
  const { myTokenSt, myStructureId } = useContext(AuthStContext);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Nouvel état pour le message de succès

  // Fonction pour demander à rejoindre une structure en tant que structure
  const structureSubmit = async (idStructure) => {
    const serverAddress = getServerAddress();
    const resultStructure = await fetch(
      serverAddress +
        "structures/" +
        myStructureId +
        "/hierarchy/" +
        idStructure,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + myTokenSt,
        },
      }
    );
    if (resultStructure.status !== 200) {
      console.log(
        "Erreur lors du join vers la structure parent, code d'erreur:" +
          resultStructure.status
      );
      return;
    } else {
      setSuccessMessage("Hierarchy modified"); // Mettre à jour le message de succès
    }
    setShowForm(false);
  };

  return (
    <div className="container">
      {successMessage && <p>{successMessage}</p>}{" "}
      {/* Afficher le message de succès s'il existe */}
      <SearchStruct structureSubmit={structureSubmit} />
    </div>
  );
};

export default Hierarchy;
