import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";
import { AuthStContext } from "../contexts/AuthSt";
import ListOfAdherents from "./ListOfAdherents";
import ListOfStructures from "./ListOfStructures";

const Sidebar = () => {
  const [structures, setStructures] = useState([]);
  const { myTokenAd } = useContext(AuthAdContext);
  const { myTokenSt } = useContext(AuthStContext);
  const { getServerAddress } = useContext(ServerContext);
  const [isStruct, setIsStruct] = useState(false); 
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
        setStructures(resultStructuresContent);
      }
    }
    getStructures();
  }, [myTokenAd, myTokenSt, getServerAddress]);

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <aside className="sidebar open">
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
      <ul>
        <li key="join" onClick={() => navigate("/badges")}>
          Voir mes badges
        </li>
      </ul>
      <ul
        className="user-actions-div"
        onClick={() => {
          toggleDropdown();
          // Propose de se déconnecter ou de changer d'utilisateur
          // navigate("/choose");
        }}
      >
        <li>Utilisateur</li>
      </ul>
      {isDropdownOpen && (
        <ul className="dropdown drop-up">
          <ListOfAdherents buttonNew={true} />

          <ListOfStructures buttonNew={true} />
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
