import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";
import ListOfAdherents from "./ListOfAdherents";

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

  //Récupérer les adhérents et structures de l'utilisateur
  const profiles = [
    { name: "Profil 1", fullName: "Jean Dupont" },
    { name: "Profil 2", fullName: "Marie Curie" },
    { name: "Profil 3", fullName: "Isaac Newton" },
  ];
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

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
      </ul>
                // <ul className="dropdown drop-up">
                //   {ListOfAdherents(profiles)}
                //     {/* {profiles.map((profile, index) => (
                //         <li key={index}>
                //             {profile.name}
                //         </li>
                //     ))} */}
                // </ul>
            )}
    </aside>
  );
};

export default Sidebar;
