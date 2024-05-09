import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [structures, setStructures] = useState([]);
  const { myTokenAd } = useContext(AuthAdContext);
  const { getServerAddress } = useContext(ServerContext);

  const switchSidebar = () => {
    setIsOpen(!isOpen);
  };

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

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="toggle-button" onClick={switchSidebar}>
        {isOpen ? "←" : "→"}
      </div>
      <ul>
        {structures.map((structure) => (
          <li key={structure[0].id_structur} onClick={() => navigate("/homeStruct/" + structure[0].nom_structure)}>{structure[0].nom_structure}</li> // Utilisez un champ unique comme `key`
        ))}
      </ul>
      <ul>
        {/* Ajoutez des clés uniques pour chaque élément */}
        <li key="join" onClick={() => navigate("/join")}>
          Rejoindre une structure
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
