import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";
import { AuthStContext } from "../contexts/AuthSt";
import { ServerContext } from "../contexts/Server";

const ListOfEvents = (props) => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { myAdToken, myAdId } = useContext(AuthAdContext);
  const { myStructToken, myStructId } = useContext(AuthStContext);
  const { getServerAddress } = useContext(ServerContext);

  const { setTokenSt, setUserIdSt, setEventId, loginSt, setNameSt, setDateSt } =
    useContext(AuthStContext);

  const navigate = useNavigate();
  const [Events, setEvents] = useState([]);

  useEffect(() => {
    const serverAddress = getServerAddress();
    let resultEvent = null;
    // Partie recherche des Events

    async function showEvents() {
      if (!myToken || !myUserId) {
        return;
      }
      if (!myStructToken || !myStructId) {
        try{
          // Récupérer tous les événements d'une structure (depuis le token d'authentification adhérent)
          resultEvent = await fetch(serverAddress + "events/ad/" + myStructId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myAdToken,
          },
        });

        }
        catch(e){
          console.log(e);
        }
      } else {
        try{
          // Récupérer tous les événements d'une structure (depuis le token d'authentification structure)
          resultEvent = await fetch(serverAddress + "events/user/allevents/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + myStructToken,
            },
          });
        }
        catch(e){
          console.log(e);
        }
      }

      if (resultEvent.status !== 200) {
        console.log("Erreur lors de la récupération des Events");
        return;
      } else {
        const resultEventContent = await resultEvent.json();
        // console.log(resultEventContent);
        if (resultEventContent.length > 0) {
          setEvents(resultEventContent);
        }
      }
    }

    showEvents();
  }, [
    getServerAddress,
    myToken,
    myUserId,
    myStructToken,
    myStructId,
    myAdToken,
  ]);

  const newEvent = () => {
    const buttonNew = props.buttonNew;

    if (buttonNew === true) {
      return (
        <li>
          <button
            className="choose-event-container"
            id="create-profile"
            onClick={() => navigate("/registerEvent")}
          ></button>
        </li>
      );
    } else {
      return;
    }
  };

  return (
    <div className="choose-event">
      <ul>
        {Events.map((Event) => (
          <li key={Event.id_structur}>
            <button
              className="choose-event-container"
              onClick={() => {
                setNameSt(Event.nom_Event);
                setDateSt(Event.date_creation);
              }}
            >
              {Event.nom_Event}
            </button>
          </li>
        ))}

        {newEvent()}
      </ul>
    </div>
  );
};

export default ListOfEvents;
