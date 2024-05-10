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
  const [ImpactList, setImpactList] = useState([]);
  const [TotalImpact, setTotalImpact] = useState(0);
  const [CompleteImpactList, setCompleteImpactList] = useState([]);
  const [errorEvent, setErrorEvent] = useState(null);

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
          console.log(
            "Erreur lors de la récupération des informations de la structure"
          );
          setError("Erreur lors de la récupération des informations.");
        }
      } catch (err) {
        console.error("Erreur :", err);
        setError("Erreur lors de la récupération des informations.");
      }
    }
    getStructInfo();
  }, [myTokenAd, getServerAddress, structName]);

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
          console.log("Erreur lors de la récupération des événements");
          setErrorEvent("Erreur lors de la récupération des événements.");
        }
      } catch (err) {
        console.error("Erreur :", err);
        setErrorEvent("Erreur lors de la récupération des événements.");
      }
    }
    getEvents();
  }, [myToken, getServerAddress, structName]);

  const toggleEventDetails = (index) => {
    const updatedEvents = [...eventsInfo];
    updatedEvents[index].isOpen = !updatedEvents[index].isOpen;
    setEventsInfo(updatedEvents);
  };

  const removeDoubleQuotes = (input) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string as input.");
    }
    return input.replace(/"+/g, "");
  };

  async function getImpact() {
    setImpactList([]);

    // Await a state update via a useEffect
    for (let i = 0; i < eventsInfo.length; i++) {
      try {
        console.log("eventsInfo[i].id_evenement", eventsInfo[i]);
        const serverAddress = getServerAddress();
        const resultImpact = await fetch(
          `${serverAddress}impact/${eventsInfo[i].id_evenement}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (resultImpact.ok) {
          const resultImpactContent = await resultImpact.json();
          // Append new impacts to the list
          setImpactList((prevList) => prevList.concat(resultImpactContent));
        }
      } catch (err) {
        console.error("Erreur :", err);
      }
    }
  }

  useEffect(() => {}, [ImpactList]);

  useEffect(() => {
    getImpact();
  }, [eventsInfo]);

  async function getImpactCalcul(i) {
    try {
      const serverAddress = getServerAddress();
      const resultImpact = await fetch(
        `${serverAddress}impact/calcul/event/${eventsInfo[i].id_evenement}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (resultImpact.ok) {
        const resultImpactContent = await resultImpact.json();
        console.log("resultImpactContent", resultImpactContent);
        const updateTotal = TotalImpact + resultImpactContent.impact;
        setTotalImpact(updateTotal);
      }
    } catch (err) {
      console.error("Erreur :", err);
    }
  }

  useEffect(() => {}, [TotalImpact]);

  useEffect(() => {
    setTotalImpact(0);
    for (let i = 0; i < eventsInfo.length; i++) {
      getImpactCalcul(i);
    }
  }, [ImpactList]);

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
            <h3>Derniers Impacts : </h3>
            <ul>
              {ImpactList.map((impact, index) => (
                <li key={index}>
                  {/* <h3>{impact.nom_impact}</h3> */}
                  <p>{impact.valeur}</p>
                  {/* <p>{impact.unite}</p> */}
                  <p>Nombre personne :{impact.nombre_personnes}</p>
                </li>
              ))}
            </ul>
            <h3>Total Impact : </h3>
            <p>{TotalImpact} kgCO2 émis</p>
            <button onClick={() => navigate("/addImpact/" + structName)}>
              Rajouter un impact
            </button>
          </div>
          <div className="event-section">
            <div className="title">
              <h2>Events</h2>
            </div>
            <div className="event-list">
              <ul className="scrollable">
                {eventsInfo.map((event, index) => (
                  <li key={index} onClick={() => toggleEventDetails(index)}>
                    <div className="event-title">
                      <h3>{event.nom_evenement}</h3>
                      <span>{event.date_debut.slice(0, 10)}</span>
                    </div>
                    gp
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
