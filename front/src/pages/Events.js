import React, { useContext } from "react";
import JoinEvent from "../components/JoinEvent";
import ListOfEvents from "../components/ListOfEvents";
import Navigation from "../components/Navigation";
import { AuthAdContext } from "../contexts/AuthAd";

const Evenements = () => {
  const { isAuthenticated } = useContext(AuthAdContext);

  return (
    <div>
      <Navigation />
      <div className="evenement">
        <h1>Évènements</h1>
        <div className="event-container">
          <div className="event-top">{!isAuthenticated && <JoinEvent />}</div>
          <div className="evenement-bot">
            <h2>Mes évènements</h2>
            <ListOfEvents buttonNewEvent={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evenements;
