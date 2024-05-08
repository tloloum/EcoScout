import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import { AuthStContext } from "../contexts/AuthSt";
import { ServerContext } from "../contexts/Server";

const ListOfEvents = (props) => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);

  const { setTokenSt, setUserIdSt, setEventId, loginSt, setNameSt, setDateSt } =
    useContext(AuthStContext);

  const navigate = useNavigate();
  const [Events, setEvents] = useState([]);

  useEffect(() => {
    const serverAddress = getServerAddress();

    // Partie recherche des Events

    async function showEvents() {
      if (!myToken || !myUserId) {
        return;
      }

      const resultEvent = await fetch(
        serverAddress + "Events/user/" + myUserId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myToken,
          },
        }
      );

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
  }, [getServerAddress, myToken, myUserId]);

  async function loginEvent(EventId) {
    const serverAddress = getServerAddress();
    console.log(serverAddress + "Events/loginstruct");

    const resultLoginEvent = await fetch(serverAddress + "Events/loginstruct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
      body: JSON.stringify({
        EventId: EventId,
      }),
    });

    if (resultLoginEvent.status !== 201) {
      console.log("Erreur lors de la connexion de la Event");
      // console.log(resultLoginEvent.status);
      return;
    } else {
      const resultLoginEventContent = await resultLoginEvent.json();
      setTokenSt(resultLoginEventContent.token);
      setUserIdSt(resultLoginEventContent.userId);
      setEventId(EventId);
      loginSt();
      navigate("/homestruct");
    }
  }

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
                loginEvent(Event.id_structur);
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
