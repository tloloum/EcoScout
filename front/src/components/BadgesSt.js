import React, { useContext, useEffect, useState } from "react";
import badge3 from "../assets/img/badgeSt/badge5.jpeg";
import badge1 from "../assets/img/badgeSt/badge6.jpeg";
import badge4 from "../assets/img/badgeSt/badge7.jpeg";
import badge2 from "../assets/img/badgeSt/badge8.jpeg";
import { AuthStContext } from "../contexts/AuthSt";
import { ServerContext } from "../contexts/Server";

const BadgesAd = () => {
  const { getServerAddress } = useContext(ServerContext);
  const { myStructureId, myTokenSt } = useContext(AuthStContext);
  const [badges, setBadges] = useState([]);

  const PossibleBadgesSt = [
    {
      name: "Badge 1",
      description: "Avoir organisé 3 évènements",
      src: badge1,
      hasTheBadge: false,
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
  ];
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const serverAddress = getServerAddress();
        const response = await fetch(`${serverAddress}${myStructureId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myTokenSt}`,
          },
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          setBadges(data);
          if (data.badges) {
            data.badges.forEach((badge) => {
              PossibleBadgesSt.forEach((possibleBadge) => {
                if (badge === possibleBadge.name) {
                  possibleBadge.hasTheBadge = true;
                  possibleBadge.description = badge.description;
                }
              });
            });
          }
        } else {
          console.log("Erreur lors de la récupération des badges");
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    fetchBadges();
  }, [getServerAddress]);
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
