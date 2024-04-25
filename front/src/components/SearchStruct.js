import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";


const SearchStruct = () => {
  const { getServerAddress } = useContext(ServerContext);
  const { myToken, myUserId } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [structures, setStructures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [idStructure, setIdStructure] = useState("");


  useEffect(() => {
    const fetchStructures = async () => {
      if (!myToken || !myUserId) {
        return;
      }
      try {
        const serverAddress = getServerAddress();
        const response = await fetch(serverAddress + "structures/searchstruct/" + searchQuery, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myToken,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setStructures(data);
          setIdStructure(data.structure.id_structur);
        } else {
          console.error("Failed to fetch structures");
        }
      } catch (error) {
        console.error("Error fetching structures:", error);
      }
    };

    fetchStructures();
  }, [getServerAddress, myToken, myUserId, searchQuery]); // Ajout de searchQuery comme dépendance

  // Fonction pour gérer le changement de la barre de recherche
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleStructureClick = (structure) => {
    console.log("Structure cliquée :", structure.nom_structure);
    setShowForm(true);
  };

  //Fonction pour ouvrir le formulaire
  const handleClick = () => {
    setShowForm(true);
  };
  async function structureSubmit(event) {
    event.preventDefault();
    const serverAddress = getServerAddress();
    console.log(serverAddress + "/structures/" + idStructure + "/join");

    // Recherche de la structure :
    const resultStructure = await fetch(
      serverAddress + "/structures/" + idStructure + "/join/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: "Bearer " + myToken,
        },
      }
    );

    if (resultStructure.status !== 201) {
      console.log("Erreur lors du join");
      return;
    } else {
      console.log(serverAddress + "structures");
      const resultStructureContent = await resultStructure.json();
      console.log(resultStructureContent);
    }

    setShowForm(false);
  }
  return (
    <div>
        <div className="input-box">
            <input
            type="search"
            name="search-form"
            id="search-form"
            className="search-input"
            onChange={handleSearchChange} // Gérer le changement de la barre de recherche
            placeholder="Rechercher une structure"
            />
        </div>
        <div className="search-results">
            {structures.map((structure, index) => (
            <div key={index} className="structure-item">
                <p>{structure.nom_structure}</p>
                <button onClick={() => handleStructureClick(structure)} className="structure-button">
                    {structure.nom_structure}
                </button>
            </div>
            ))}
        </div>
    </div>
    
  );
};

export default SearchStruct;
