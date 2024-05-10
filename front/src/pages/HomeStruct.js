import React, { useContext, useState, useEffect } from "react";
import { AuthStContext } from "../contexts/AuthSt";
import { AuthContext } from "../contexts/Auth";
import logo from "../assets/img/logo.jpeg";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import { AuthAdContext } from "../contexts/AuthAd";
import { useNavigate } from "react-router-dom";
import { ServerContext } from "../contexts/Server";

const HomeStruct = () => {
  const [structName, setStructName] = useState("");
  const { myTokenAd } = useContext(AuthAdContext);
  const { getServerAddress } = useContext(ServerContext);
  const { myToken } = useContext(AuthContext);
  const [structInfo, setStructInfo] = useState(null);
  const [eventsInfo, setEventsInfo] = useState([]);
  const [error, setError] = useState(null);
  const [impactList, setImpactList] = useState([]);
  const [totalImpact, setTotalImpact] = useState(0);
  const [errorEvent, setErrorEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const navigate = useNavigate();
  const { myTokenSt, isAuthenticatedSt, getNameSt, signOutSt } =
    useContext(AuthStContext);
  const { signOut, isAuthenticated } = useContext(AuthContext);
  const nameSt = getNameSt();

  const deco = () => {
    signOutSt();
    signOut();
    navigate("/");
  };

  const switchProfil = () => {
    signOutSt();
    if (isAuthenticated) {
      navigate("/choose");
    } else {
      navigate("/");
    }
  };

  // Get structure information
  useEffect(() => {
    async function getStructInfo() {
      try {
        const serverAddress = getServerAddress();
        const resultStructInfo = await fetch(`${serverAddress}structures/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myTokenSt}`,
          },
        });

        if (resultStructInfo.ok) {
          const resultStructInfoContent = await resultStructInfo.json();
          setStructName(resultStructInfoContent.nom_structure);
          setStructInfo(resultStructInfoContent);
        } else {
          setError("Erreur lors de la récupération des informations.");
        }
      } catch (err) {
        console.error("Erreur :", err);
        setError("Erreur lors de la récupération des informations.");
      }
    }
    getStructInfo();
  }, [myTokenSt, getServerAddress]);

  // Get structure events
  useEffect(() => {
    if (myTokenAd !== null) {
      return;
    }
    async function getEvents() {
      console.log("getting events for " + structName);
      setEventsInfo([]);
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
          if (resultEventsContent.length === 0) {
            setErrorEvent("Aucun événement trouvé.");
          }
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
      console.log(eventsInfo);
    }
    getEvents();
  }, [myToken, getServerAddress, structName]);

  // Get the impact list for each event
  useEffect(() => {
    async function fetchImpactList() {
      console.log("Fetching impact list with " + structName);
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
      setImpactList(newImpactList);
      setIsLoading(false); // Set loading state to false after data is loaded
    }

    if (eventsInfo.length > 0) {
      fetchImpactList();
    }
  }, [eventsInfo, structName, getServerAddress]);

  // Calculate the total impact
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

  // Display loading state
  if (isLoading) {
    return (
      <div className="home-struct-ad">
        <Sidebar />
        <div className="content">
          <h1>Chargement...</h1>
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
                  <p>{impact.valeur}</p>
                  <p>Nombre personne : {impact.nombre_personnes}</p>
                </li>
              ))}
            </ul>
            <h3>Total Impact :</h3>
            <p>{totalImpact} kgCO2 émis</p>
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
              <button onClick={() => navigate("/addEvent/" + getNameSt())}>
                Ajouter un événement
              </button>
            </div>
          </div>
        </div>
        <div className="list-members">
          <h2>Liste des membres</h2>
          {/* Ajoutez votre liste de membres ici */}
        </div>
      </div>
      <button onClick={() => navigate("/demands")}>
        Demande(s) en attente
      </button>
      <button onClick={() => navigate("/hierarchy")}>Gérer la hierarchy</button>
    </div>
  );
};

export default HomeStruct;
