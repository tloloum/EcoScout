import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthAdContext } from "../contexts/AuthAd";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";
import Sidebar from "../components/Sidebar";

const HomeStructAd = () => {
  const { name: structName } = useParams();
  const { getServerAddress } = useContext(ServerContext);
  const { myTokenAd } = useContext(AuthAdContext);
  const { myToken } = useContext(AuthContext);
  const [structInfo, setStructInfo] = useState(null); // Utilisez `null` pour l'initialisation
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getStructInfo() {
      try {
        const serverAddress = getServerAddress();
        const resultStructInfo = await fetch(
          `${serverAddress}structures/searchstruct/${structName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${myTokenAd}`,
            },
          }
        );

        if (resultStructInfo.ok) {
          const resultStructInfoContent = await resultStructInfo.json();
          setStructInfo(resultStructInfoContent[0]);
        } else {
          console.log("Erreur lors de la récupération des informations de la structure");
          setError("Erreur lors de la récupération des informations.");
        }
      } catch (err) {
        console.error("Erreur :", err);
        setError("Erreur lors de la récupération des informations.");
      }
    }
    getStructInfo();
  }, [myTokenAd, getServerAddress, structName]);

  // Vérifiez l'état avant d'accéder aux propriétés
  if (error) {
    return (
      <div className="home-struct-ad">
        <Sidebar />
        <div className="content">
          <h1>Erreur</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-struct-ad">
      <Sidebar />
      <div className="content">
        <div className="name">
          <h1>{structInfo ? structInfo.nom_structure : "Chargement..."}</h1>
        </div>
        <div className="impact-event-container">
          <div className="impact-section">
            <h2>Impacts</h2>
            <ul>
              Impact {/* Remplacez par les éléments appropriés */}
            </ul>
            <button onClick={() => navigate("/addImpact/" + structName)}>Rajouter un impact</button>
          </div>
          <div className="event-section">
            <h2>Events</h2>
            <ul>
              Events {/* Remplacez par les éléments appropriés */}
            </ul>
          </div>
        </div>
        <div className="list-members">
          <h2>Liste des membres</h2>
          {/* Ajoutez votre liste de membres ici */}
        </div>
      </div>
    </div>
  );
};

export default HomeStructAd;
