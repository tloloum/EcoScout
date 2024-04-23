import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";

const AllStructs = () => {
  const { getServerAddress } = useContext(ServerContext);
  const { myToken, myUserId } = useContext(AuthContext);
  const [structures, setStructures] = useState([]);

  useEffect(() => {
    const fetchStructures = async () => {
        if (!myToken || !myUserId) {
            return;
          }
      try {
        const serverAddress = getServerAddress();
        const response = await fetch(serverAddress + "structures/allstruct", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + myToken,
              },
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStructures(data);
        } else {
          console.error("Failed to fetch structures");
        }
      } catch (error) {
        console.error("Error fetching structures:", error);
      }
    };

    fetchStructures();
  }, [getServerAddress]);

  return (
    <div>
      <h2>Liste des structures</h2>
      <ul>
        {structures.map((structure) => (
          <li key={structure.id}>
            {structure.nom_structure} - {structure.date_creation}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllStructs;
