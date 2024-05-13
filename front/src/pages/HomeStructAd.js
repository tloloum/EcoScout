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
  const [structInfo, setStructInfo] = useState(null);
  const [eventsInfo, setEventsInfo] = useState([]);
  const [error, setError] = useState(null);
  const [impactList, setImpactList] = useState([]);
  const [totalImpact, setTotalImpact] = useState(0);
  const [errorEvent, setErrorEvent] = useState(null);

  const navigate = useNavigate();

  const removeDoubleQuotes = (input) => {
    if (typeof input !== "string") {
      return input;
    }
    return input.replace(/"+/g, "");
  };

  // Obtenir les informations de la structure
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
          setError("Erreur lors de la récupération des informations.");
        }
      } catch (err) {
        console.error("Erreur :", err);
        setError("Erreur lors de la récupération des informations.");
      }
    }
    getStructInfo();
  }, [myTokenAd, getServerAddress, structName]);

  // Obtenir les événements de la structure
  useEffect(() => {
    async function getEvents() {
      try {
        const serverAddress = getServerAddress();
        const resultEvents = await fetch(
          `${serverAddress}events/allevents/${structName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${myToken}`,
            },
          }
        );
        if (resultEvents.ok) {
          const resultEventsContent = await resultEvents.json();
          const eventsWithState = resultEventsContent.map((event) => ({
            ...event,
            isOpen: false,
          }));
          setEventsInfo(eventsWithState);
        } else {
          setErrorEvent("Erreur lors de la récupération des événements.");
        }
      } catch (err) {
        console.error("Erreur :", err);
        setErrorEvent("Erreur lors de la récupération des événements.");
      }
    }
    getEvents();
  }, [myToken, getServerAddress, structName]);

  // Obtenir la liste des impacts pour chaque événement
  useEffect(() => {
    async function fetchImpactList() {
      const newImpactList = [];
      for (const event of eventsInfo) {
        try {
          const serverAddress = getServerAddress();
          const resultImpact = await fetch(
            `${serverAddress}impact/${event.id_evenement}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (resultImpact.ok) {
            const resultImpactContent = await resultImpact.json();
            newImpactList.push(...resultImpactContent);
          }
        } catch (err) {
          console.error("Erreur :", err);
        }
      }
      setImpactList(newImpactList.slice(-3));
    }

    if (eventsInfo.length > 0) {
      fetchImpactList();
    }
  }, [eventsInfo, getServerAddress]);

  // Calculer le total des impacts
  useEffect(() => {
    const calculateTotalImpact = impactList.reduce(
      (accum, impact) => accum + (impact.valeur || 0),
      0
    );
    setTotalImpact(calculateTotalImpact);
  }, [impactList]);

  const toggleEventDetails = (index) => {
    const updatedEvents = [...eventsInfo];
    updatedEvents[index].isOpen = !updatedEvents[index].isOpen;
    setEventsInfo(updatedEvents);
  };

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
            <div className="title">
              <h2>Impacts</h2>
            </div>
            <h3>Derniers Impacts :</h3>
            <ul>
              {impactList.map((impact, index) => (
                <li key={index}>
                  <p>{removeDoubleQuotes(impact.nom_impact)}</p>
                  <p>Nombre personne : {impact.nombre_personnes}</p>
                </li>
              ))}
            </ul>
            <h3>Total Impact :</h3>
            <p>{totalImpact} kgCO2 émis</p>
            <button onClick={() => navigate("/addImpact/" + structName)}>
              Ajouter un impact
            </button>
          </div>
          <div className="event-section">
            <div className="title">
              <h2>Événements</h2>
            </div>
            <div className="event-list">
              <ul className="scrollable">
                {eventsInfo.map((event, index) => (
                  <li key={index} onClick={() => toggleEventDetails(index)}>
                    <div className="event-title">
                      <h3>{event.nom_evenement}</h3>
                      <span>{event.date_debut.slice(0, 10)}</span>
                    </div>
                    {event.isOpen && (
                      <div className="event-details">
                        <p>Description : {event.descr}</p>
                        <p>Lieu : {event.lieu}</p>
                        <p>Durée : {event.duree_evenement} jours</p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
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
