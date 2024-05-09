import React, { useContext, useEffect, useState } from "react";
import { AuthStContext } from '../contexts/AuthSt';
import { ServerContext } from "../contexts/Server";

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
                const response = await fetch(serverAddress + "structures/demand/" + myStructureId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + myTokenSt,
                    },
                });
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

    const DeleteDemand = async (idAdherent) => {
      try {
        const serverAddress = getServerAddress();
        console.log(serverAddress + "structures/demand/" + myStructureId + "/adherent/" + idAdherent);
        const response = await fetch( serverAddress + "structures/demand/" + myStructureId + "/adherent/" + idAdherent,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + myTokenSt,
            },
        });
        if (response.ok) {
              console.log("Demande supprimée avec succès");
        } else {
            console.error("Échec de la supression de demande :", response.status);
        }
    } catch (error) {
        console.error("Erreur lors de la supression de demande :", error);
    }

    };

    const AcceptDemand = async (actualDemand) => {
      if (!myTokenSt || !myStructureId) {
          return;
      }
      try {
          const serverAddress = getServerAddress();
          const response = await fetch(serverAddress + "structures/" + myStructureId + "/join/" + actualDemand, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + myTokenSt,
              },
          });
          if (response.ok) {
                console.log("Demande acceptée avec succès");
                setDemands(demands.filter((demand) => demand.id_adherent !== actualDemand));
          } else {
              console.error("Échec de la demande d'acceptation :", response.status);
          }
          DeleteDemand(actualDemand);
      } catch (error) {
          console.error("Erreur lors de la demande d'acceptation :", error);
      }
    };

    const DenieDemand = async (actualDemand) => {
      if (!myTokenSt || !myStructureId) {
          return;
      }
      DeleteDemand(actualDemand);
    };
  
    


    return (
        <div>
            <h2>Liste des demandes :</h2>
            {demands.length > 0 ? (
                <ul>
                    {demands.map((demand, index) => (
                        <li key={index}>
                            {demand.nom_ad}
                            {demand.prenom_ad}
                            <button onClick={() => AcceptDemand(demand.id_adherent) } >Accepter</button>
                            <button onClick={() => DenieDemand(demand.id_adherent) } >Refuser</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Pas de nouvelles demandes.</p>
            )}
        </div>
    );
};

export default SeeDemands;