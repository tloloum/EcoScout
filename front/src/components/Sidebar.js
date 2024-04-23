import React, { useContext, useState, useEffect } from "react";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [structures, setStructures] = useState([]);
  const { myTokenAd, myAdherentId } = useContext(AuthAdContext);
  const { getServerAddress } = useContext(ServerContext);

  const switchSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigate=useNavigate();

  useEffect(() => {
    async function getStructures() {
      const serverAddress = getServerAddress();

      const resultStructures = await fetch(
        serverAddress + "structures/adherent/" + myAdherentId,
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
  });

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="toggle-button" onClick={switchSidebar}>
        {isOpen ? "←" : "→"}
      </div>
      <ul>
        {structures.map((structure) => (
          <li key={structure.id}>{structure.name}</li>
        ))}
      </ul>
      <ul>
        <button className="button-join" onClick={() =>navigate('/join')}> 
        </button>
      </ul>
    </aside>
  );
};

export default Sidebar;
