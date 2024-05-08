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

    // const AcceptDemand = async () => {
    //   if (!myTokenSt || !myStructureId) {
    //       return;
    //   }
    //   try {
    //       const serverAddress = getServerAddress();
    //       const response = await fetch(serverAddress + "structures/" + myStructureId + "/join", {
    //           method: "POST",
    //           headers: {
    //               "Content-Type": "application/json",
    //               Authorization: "Bearer " + myTokenSt,
    //           },
    //       });
    //       if (response.ok) {
    //           // Gérer la réponse si nécessaire
    //       } else {
    //           console.error("Échec de la demande d'acceptation :", response.status);
    //       }
    //   } catch (error) {
    //       console.error("Erreur lors de la demande d'acceptation :", error);
    //   }
    // };
  
    


    return (
        <div>
            <h2>Liste des demandes :</h2>
            {demands.length > 0 ? (
                <ul>
                    {demands.map((demand, index) => (
                        <li key={index}>
                            {demand.nom_ad}
                            {demand.prenom_ad}
                            {/* <button onClick={AcceptDemand} >Accepter</button> */}
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
