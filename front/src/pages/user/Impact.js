import React, { useState } from "react";

const CalculateImpact = () => {
  const [typeMoteur, setTypeMoteur] = useState("");
  const [distance, setDistance] = useState("");
  const [nombrePassagers, setNombrePassagers] = useState("");
  const [vehicule, setVehicule] = useState("");
  const [erreurMessage, setErreurMessage] = useState("");

  const handleTypeMoteurChange = (event) => {
    setTypeMoteur(event.target.value);
  };

  const handleDistanceChange = (event) => {
    setDistance(event.target.value);
  };

  const handleNombrePassagersChange = (event) => {
    setNombrePassagers(event.target.value);
  };

  const handleVehiculeChange = (event) => {
    setVehicule(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/calcul", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type_moteur: typeMoteur,
        distance: distance,
        nombre_passagers: nombrePassagers,
        vehicule: vehicule,
      }),
    });

    if (!response.ok) {
      setErreurMessage("Erreur lors du calcul de l'impact");
      return;
    }

    const data = await response.json();
    console.log("Ecological Impact:", data.consommation);
  };

  return (
    <div className="register-impact">
      <h2>Calculer l'impact écologique</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Type de moteur:
          <select value={typeMoteur} onChange={handleTypeMoteurChange}>
            <option value="E85">E85</option>
            <option value="essence">Essence</option>
            <option value="gazole">Gazole</option>
            <option value="GNV">GNV</option>
            <option value="GPL">GPL</option>
            <option value="moyenne">Moyenne</option>
          </select>
        </label>
        <br />
        <label>
          Distance (km):
          <input
            type="number"
            value={distance}
            onChange={handleDistanceChange}
          />
        </label>
        <br />
        <label>
          Nombre de Passagers:
          <input
            type="number"
            value={nombrePassagers}
            onChange={handleNombrePassagersChange}
          />
        </label>
        <br />
        <label>
          Vehicule:
          <input type="text" value={vehicule} onChange={handleVehiculeChange} />
        </label>
        <br />
        <button type="submit">Calculer</button>
      </form>
      <p>{erreurMessage}</p>
    </div>
  );
};

export default CalculateImpact;
