import React, { useContext, useState, useEffect } from "react";
import { AuthStContext } from "../contexts/AuthSt";
import { AuthContext } from "../contexts/Auth";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";

const HomeStruct = () => {
  const [structName, setStructName] = useState("");
  const { myTokenAd } = useContext(AuthAdContext);
  const { getServerAddress } = useContext(ServerContext);
  const { myToken } = useContext(AuthContext);
  const [structInfo, setStructInfo] = useState(null);
  const [eventsInfo, setEventsInfo] = useState([]);
  const [impactList, setImpactList] = useState([]);
  const [totalImpact, setTotalImpact] = useState(0);
  const [error, setError] = useState(null);
  const [errorEvent, setErrorEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for the menu visibility
  const navigate = useNavigate();
  const { myTokenSt, getNameSt, signOutSt } = useContext(AuthStContext);
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

  // Toggle the visibility of the menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
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
          const textResponse = await resultStructInfo.text(); // Get full response as text for debugging
          console.error("Error Response:", textResponse);
          setError("Erreur lors de la récupération des informations.");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors de la récupération des informations.");
      }
    }
    getStructInfo();
  }, [myTokenSt, getServerAddress]);

  // Get structure events
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
          if (resultEventsContent.length === 0) {
            setEventsInfo([]);
            setImpactList([]);
            setErrorEvent("Aucun événement trouvé.");
          } else {
            const eventsWithState = resultEventsContent.map((event) => ({
              ...event,
              isOpen: false,
            }));
            setEventsInfo(eventsWithState);
            setErrorEvent(null); // Clear any previous errors if events are found
          }
        } else {
          const textResponse = await resultEvents.text(); // Get full response as text for debugging
          console.error("Error Response:", textResponse);
          setEventsInfo([]);
          setImpactList([]);
          setErrorEvent("Erreur lors de la récupération des événements.");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setEventsInfo([]);
        setImpactList([]);
        setErrorEvent("Erreur lors de la récupération des événements.");
      }
      setIsLoading(false);
    }

    if (myTokenAd === null) {
      getEvents();
    }
  }, [myToken, getServerAddress, structName, myTokenAd]);

  // Get the impact list for each event
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
      setImpactList(newImpactList);
    }

    if (eventsInfo.length > 0) {
      fetchImpactList();
    } else {
      setImpactList([]); // Clear impact list if no events are present
    }
  }, [eventsInfo, getServerAddress]);

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
    <div className="home-struct">
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
        <div className="list-members" onClick={toggleMenu}>
          <h2>Gérer les membres</h2>
        </div>
        {isMenuOpen && (
          <ul className="manage-members-menu">
            <li onClick={() => navigate("/membersList")}>Liste des membres</li>
            <li onClick={() => navigate("/demands")}>Demandes en attente</li>
            <li onClick={() => navigate("/hierarchy")}>Gérer la hiérarchie</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomeStruct;
