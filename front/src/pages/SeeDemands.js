import React, { useContext, useEffect, useState } from "react";
import { AuthStContext } from "../contexts/AuthSt";
import { ServerContext } from "../contexts/Server";
import Sidebar from "../components/Sidebar";

const SeeDemands = () => {
  const { myTokenSt, myStructureId } = useContext(AuthStContext);
  const { getServerAddress } = useContext(ServerContext);
  const [demands, setDemands] = useState([]);

  useEffect(() => {
    const fetchDemands = async () => {
      if (!myTokenSt || !myStructureId) {
        return;
      }
      try {
        const serverAddress = getServerAddress();
        const response = await fetch(
          serverAddress + "structures/demand/" + myStructureId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + myTokenSt,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setDemands(data);
        } else {
          console.error("Failed to fetch structures");
        }
      } catch (error) {
        console.error("Error fetching demands:", error);
      }
    };
    fetchDemands();
  }, [myTokenSt, myStructureId, getServerAddress]);

  const deleteDemand = async (idAdherent) => {
    try {
      const serverAddress = getServerAddress();
      const response = await fetch(
        serverAddress +
          "structures/demand/" +
          myStructureId +
          "/adherent/" +
          idAdherent,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myTokenSt,
          },
        }
      );
      if (response.ok) {
        console.log("Demande supprimée avec succès");
      } else {
        console.error("Échec de la suppression de demande :", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de demande :", error);
    }
  };

  const acceptDemand = async (actualDemand) => {
    if (!myTokenSt || !myStructureId) {
      return;
    }
    try {
      const serverAddress = getServerAddress();
      const response = await fetch(
        serverAddress + "structures/" + myStructureId + "/join/" + actualDemand,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myTokenSt,
          },
        }
      );
      if (response.ok) {
        console.log("Demande acceptée avec succès");
        setDemands(
          demands.filter((demand) => demand.id_adherent !== actualDemand)
        );
      } else {
        console.error("Échec de la demande d'acceptation :", response.status);
      }
      deleteDemand(actualDemand);
    } catch (error) {
      console.error("Erreur lors de la demande d'acceptation :", error);
    }
  };

  const denyDemand = async (actualDemand) => {
    if (!myTokenSt || !myStructureId) {
      return;
    }
    deleteDemand(actualDemand);
  };

  return (
    <div className="see-demands">
      <Sidebar />
      <h2>Liste des demandes :</h2>
      {demands.length > 0 ? (
        <ul>
          {demands.map((demand, index) => (
            <li key={index}>
              {demand.nom_ad} {demand.prenom_ad}
              <div className="button-container">
                <button
                  className="accept"
                  onClick={() => acceptDemand(demand.id_adherent)}
                >
                  Accepter
                </button>
                <button
                  className="denie"
                  onClick={() => denyDemand(demand.id_adherent)}
                >
                  Refuser
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-demand-message">Pas de nouvelles demandes.</p>
      )}
    </div>
  );
};

export default SeeDemands;
