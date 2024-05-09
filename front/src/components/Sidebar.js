import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";

const Sidebar = () => {
  // Supprimez l'état de `isOpen` car la sidebar sera toujours ouverte
  const [structures, setStructures] = useState([]);
  const { myTokenAd } = useContext(AuthAdContext);
  const { getServerAddress } = useContext(ServerContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getStructures() {
      const serverAddress = getServerAddress();

      const resultStructures = await fetch(
        `${serverAddress}structures/adherent/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myTokenAd,
          },
        }
      );

      if (resultStructures.status !== 200) {
        console.log("Erreur lors de la récupération des structures");
        return;
      } else {
        const resultStructuresContent = await resultStructures.json();
        if (resultStructuresContent.length > 0) {
          setStructures(resultStructuresContent);
        }
      }
    }
    getStructures();
  }, [myTokenAd, getServerAddress]);

  // La sidebar reste toujours ouverte, supprimez `isOpen`
  return (
    <aside className="sidebar open">
      {/* Supprimez l'élément du bouton de basculement */}
      <ul>
        {structures.map((structure) => (
          <li
            key={structure[0].id_structur}
            onClick={() =>
              navigate("/homeStruct/" + structure[0].nom_structure)
            }
          >
            {structure[0].nom_structure}
          </li>
        ))}
      </ul>
      <ul>
        <li key="join" onClick={() => navigate("/join")}>
          Rejoindre une structure
        </li>
      </ul>
      <ul>
        <li onClick={() => navigate("/evenements")}>Mes évènements</li>
      </ul>
      <ul
        className="user-actions-div"
        onClick={() => {
          // Propose de se déconnecter ou de changer d'utilisateur
          navigate("/choose");
        }}
      >
        <li>Changer d'utilisateur</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
