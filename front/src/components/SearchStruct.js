import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/Auth";
import {AuthAdContext} from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";
import { useNavigate } from 'react-router-dom';

const SearchStruct = () => {
  const { getServerAddress } = useContext(ServerContext);
  const { myToken, myUserId } = useContext(AuthContext);
  const { myAdherentId, myTokenAd } = useContext(AuthAdContext);
  const [searchQuery, setSearchQuery] = useState('');
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
        } else {
          console.error("Failed to fetch structures");
        }
      } catch (error) {
        console.error("Error fetching structures:", error);
      }
    };

    fetchStructures();
  }, [getServerAddress, searchQuery]);

  // Fonction pour gérer le changement de la barre de recherche
  const handleSearchChange = (event) => {
    setShowForm(false);
    setSearchQuery(event.target.value);
  };

  //Fonction pour gérer le click sur une structure, quand on clique, on garde l'ID de la structure pour éventuellement join
  const handleStructureClick = () => {
    setIdStructure('');
    if(showForm==true){
      setShowForm(false);
    }
    else{
      setShowForm(true);
    }
    if (Array.isArray(structures) && structures.length > 0) {
      setIdStructure(structures[0].id_structur.toString());
    }
    
  };

  //Fonction pour retourner sur le profil
  const back2profile = () => {
    navigate('/homead');
  }

  //Fonction pour demander à join une structure en temps qu'adhérent. Ne marche pas pour l'instant
  const structureSubmit = async () => {
    const serverAddress = getServerAddress();
    console.log(serverAddress + "structures/demand/" + idStructure + "/adherent/" + myAdherentId);
    const resultStructure = await fetch(
      serverAddress + "structures/demand/" + idStructure + "/adherent/" + myAdherentId, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: "Bearer " + myTokenAd,  
        },
      }
    );
    if (resultStructure.status !== 201) {
      console.log("Erreur lors de la demande de join, code d'erreur:" + resultStructure.status);
      return;
    } else {
      console.log(serverAddress + "structures");
      const resultStructureContent = await resultStructure.json();
      console.log(resultStructureContent);
    }
    setShowForm(false);
  }
  
  //Fonction pour tester structureSubmit
  const structureSubmitTest = () => {
    setIdStructure('2');
    structureSubmit();
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
                <button onClick={() => handleStructureClick(structure)} className="structure-button">
                    {structure.nom_structure}
                </button>
            </div>
            ))}
        </div>
        {showForm && (
        <form onSubmit={structureSubmit}>
          <button type="submit">Rejoindre</button>
        </form>
      )}
      <button onClick={back2profile}>
        Retour au profil
      </button>
      <button onClick={structureSubmitTest}>
        test
      </button>
    </div>
  );
};

export default SearchStruct;
