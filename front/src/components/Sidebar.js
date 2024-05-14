import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";
import { AuthStContext } from "../contexts/AuthSt";
import ListOfAdherents from "./adherent/ListOfAdherents";
import ListOfStructures from "./structures/ListOfStructures";
import logo from "../assets/img/logo.jpeg";

const Sidebar = () => {
  const [structures, setStructures] = useState([]);
  const { myTokenAd, isAuthenticatedAd } = useContext(AuthAdContext);
  const { myTokenSt, myNameSt } = useContext(AuthStContext);
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
    if (myTokenAd) getStructures();
    else setStructures([]);
  }, [myTokenAd, myTokenSt, getServerAddress]);

  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <aside className="sidebar open">
      <img
        src={logo}
        alt="Logo"
        onClick={() => {
          if (!myTokenAd) {
            navigate(`/homeStruct/${myNameSt}`);
          } else {
            navigate(`/homeAd`);
          }
        }}
        style={{
          width: "75px",
          height: "auto",
          display: "block",
          margin: " auto",
        }}
      />
      <ul>
        {structures.map((structure) => (
          <li
            key={structure[0].id_structur}
            onClick={() =>
              navigate("/homeStructAd/" + structure[0].nom_structure)
            }
          >
            {structure[0].nom_structure}
          </li>
        ))}
      </ul>
      {isAuthenticatedAd && (
        <ul>
          <li key="join" onClick={() => navigate("/join")}>
            Rejoindre une structure
          </li>
        </ul>
      )}
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
