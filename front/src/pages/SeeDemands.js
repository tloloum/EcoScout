import React, { useContext, useEffect, useState } from "react";
import { AuthStContext } from '../contexts/AuthSt';
import { AuthContext } from '../contexts/Auth';
import { ServerContext } from "../contexts/Server";


const SeeDemands = () => {
    const { myTokenSt, myStructureId } = useContext(AuthStContext);
    const { getServerAddress } = useContext(ServerContext);
    const [demands, setDemands] = useState([]);
    
    const AcceptJoin = () => {
       
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
        });
    }
    return (
      <div>
          <h2>Liste des demandes :</h2>
          <ul>
              {demands.map((demand, index) => (
                  <li key={index}>
                      {demands.nom_ad}
                  </li>
              ))}
          </ul>
      </div>
  );
}
export default SeeDemands;