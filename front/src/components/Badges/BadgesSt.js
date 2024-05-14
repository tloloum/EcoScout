import React, { useContext, useEffect, useState } from "react";
import badge3 from "../../assets/img/badgeSt/badge5.jpeg";
import badge1 from "../../assets/img/badgeSt/badge6.jpeg";
import badge4 from "../../assets/img/badgeSt/badge7.jpeg";
import badge2 from "../../assets/img/badgeSt/badge8.jpeg";
import { AuthStContext } from "../../contexts/AuthSt";
import { ServerContext } from "../../contexts/Server";
import { AuthContext } from "../../contexts/Auth";  
import { set } from "react-hook-form";

const BadgesAd = ({hasOrganisedEvents}) => {
  const { getServerAddress } = useContext(ServerContext);
  const { myStructureId, myTokenSt ,getNameSt} = useContext(AuthStContext);
  const [badges, setBadges] = useState([]);
  const [structInfo, setStructInfo] = useState(null);
  const [eventsInfo, setEventsInfo] = useState([]);
  const { myToken } = useContext(AuthContext);
  const [obtainedBadge, setObtainedBadge] = useState(false);


  const [PossibleBadgesSt, setPossibleBadges] = useState([
    {
      name: "Badge event",
      description: "Avoir organisé 3 évènements",
      src: badge1,
      hasTheBadge: hasOrganisedEvents,
    },
    {
      name: "Badge 2",
      description: "avoir plus de 100 adhérents",
      src: badge2,
      hasTheBadge: false,
    },
    {
      name: "Badge 3",
      description: "impact co2 réduit de 10% entre deux évènements",
      src: badge3,
      hasTheBadge: false,
    },
    {
      name: "Badge 4",
      description: "rejoindre une communauté de 10 structures",
      src: badge4,
      hasTheBadge: false,
    },
  ]);
  
  // // // Get structure events
  useEffect(() => {
    async function getNumberEvents() {
      try {
        const serverAddress = getServerAddress();
        const resultEvents = await fetch(
          `${serverAddress}events/allevents/${getNameSt()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${myToken}`,
            },
          }
        );

        if (resultEvents.ok) {
          console.log("fetching info is ok");
          const textResponse = await resultEvents.text(); // Get response as text first
          console.log(textResponse);
          let resultEventsContent;
          try {
            resultEventsContent = JSON.parse(textResponse); // Try to parse JSON
            const hasOrganisedEvents = resultEventsContent.length >= 3;

          setPossibleBadges((prevBadges) =>
          prevBadges.map((badge) =>
            badge.name === "Badge event"
              ? { ...badge, hasTheBadge: hasOrganisedEvents }
              : badge
          )
        );
          } catch (error) {
            throw new Error(`Invalid JSON response: ${textResponse}`);
          }
        }}catch (err) {
          console.error("Erreur:", err);
        }}
        getNumberEvents();
      }, [myToken, getServerAddress, getNameSt]);


  return (
    <div>
      <div className="badges-list">
        {PossibleBadgesSt.map((badge, index) => (
          <div key={index} className="badge-item">
            <img
              src={badge.src}
              alt={badge.name}
              className={badge.hasTheBadge ? "img" : "badge-img-bw"}
            />
            <div className="badge-details">
              <h4>{badge.description}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  };

export default BadgesAd;
