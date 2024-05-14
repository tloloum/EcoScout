import React, { useContext, useEffect, useState } from "react";
import badge1 from "../../assets/img/badgeAd/badge1.jpeg";
import badge2 from "../../assets/img/badgeAd/badge2.jpeg";
import badge3 from "../../assets/img/badgeAd/badge3.jpeg";
import badge4 from "../../assets/img/badgeAd/badge4.jpeg";
import { AuthAdContext } from "../../contexts/AuthAd";
import { ServerContext } from "../../contexts/Server";

const BadgesAd = () => {
  const { getServerAddress } = useContext(ServerContext);
  const { myAdherentId, myTokenAd } = useContext(AuthAdContext);
  const [badges, setBadges] = useState([]);

  const PossibleBadgesAd = [
    {
      name: "Badge 1",
      description: "Avoir participé à 3 évènements",
      src: badge1,
      hasTheBadge: false,
      condition: user => user.eventsParticipated >= 3,
    },
    {
      name: "Badge 2",
      description: "Recommander l'application à 3 amis",
      src: badge2,
      hasTheBadge: false,
      condition: user => user.friendsReferred >= 3,
    },
    {
      name: "Badge 3",
      description: "Rejoindre une communauté de 10 adhérents",
      src: badge3,
      hasTheBadge: false,
      condition: user => user.communityMembers >= 10,
    },
    {
      name: "Badge 4",
      description: "Avoir un impact co2 réduit de 10% entre deux évènements",
      src: badge4,
      hasTheBadge: false,
      condition: user => user.co2Reduction >= 10,
    },
  ];

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const serverAddress = getServerAddress();
        const response = await fetch(`${serverAddress}adherent/${myAdherentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${myTokenAd}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBadges(data.badges || []);
          updateBadgeStatus(data);
        } else {
          console.log("Erreur lors de la récupération des badges");
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    fetchBadges();
  }, [getServerAddress, myAdherentId, myTokenAd]);

  const updateBadgeStatus = (userData) => {
    const updatedBadges = PossibleBadgesAd.map(badge => {
      if (badge.condition(userData)) {
        badge.hasTheBadge = true;
      }
      return badge;
    });
    setBadges(updatedBadges);
    saveBadges(updatedBadges.filter(badge => badge.hasTheBadge));
  };

  const saveBadges = async (earnedBadges) => {
    try {
      const serverAddress = getServerAddress();
      const response = await fetch(`${serverAddress}adherent/${myAdherentId}/badges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${myTokenAd}`,
        },
        body: JSON.stringify({ badges: earnedBadges.map(badge => badge.name) }),
      });
      if (!response.ok) {
        console.log("Erreur lors de la sauvegarde des badges");
      }
    } catch (error) {
      console.error("Error saving badges:", error);
    }
  };

  return (
    <div>
      <div className="badges-list">
        {PossibleBadgesAd.map((badge, index) => (
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
