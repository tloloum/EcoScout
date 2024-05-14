import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/Auth";
import { AuthAdContext } from "../../contexts/AuthAd";
import { ServerContext } from "../../contexts/Server";
import { useNavigate } from "react-router-dom";

const SearchStruct = ({ structureSubmit }) => {
  const { getServerAddress } = useContext(ServerContext);
  const { myToken, myUserId } = useContext(AuthContext);
  const { myAdherentId, myTokenAd } = useContext(AuthAdContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [structures, setStructures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [idStructure, setIdStructure] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStructures = async () => {
      if (!myToken || !myUserId) {
        return;
      }
      try {
        const serverAddress = getServerAddress();
        const response = await fetch(
          serverAddress + "structures/searchstruct/" + searchQuery,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + myToken,
            },
          }
        );
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
    if (searchQuery.length > 0) {
      fetchStructures();
    }
  }, [getServerAddress, searchQuery]);

  // Fonction pour gérer le chargement de la barre de recherche
  const handleSearch = (event) => {
    setShowForm(false);
    setSearchQuery(event.target.value);
  };

  //Fonction pour gérer le click sur une structure, quand on clique, on garde l'ID de la structure pour éventuellement join
  const handleStructureClick = () => {
    setIdStructure("");
    if (showForm == true) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
    if (Array.isArray(structures) && structures.length > 0) {
      setIdStructure(structures[0].id_structur.toString());
    }
  };

  //Fonction pour retourner sur le profil
  const back2profile = () => {
    navigate("/homead");
  };

  return (
    <div className="container">
      <div className="search-box">
        <input
          type="search"
          name="search-form"
          id="search-form"
          className="search-input"
          // onChange={handleSearchChange}
          placeholder="Rechercher une structure"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e);
            }
          }}
        />
      </div>
      <div className="search-results">
        {structures.map((structure, index) => (
          <div key={index} className="structure-item">
            <button
              onClick={() => handleStructureClick(structure)}
              className="structure-button"
            >
              {structure.nom_structure}
            </button>
            {showForm && (
              <button
                onClick={() => structureSubmit(idStructure)}
                className="submit-button"
              >
                Rejoindre
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={back2profile}>Retour au profil</button>
      </div>
    </div>
  );
};

export default SearchStruct;
