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
  const [PossibleBadgesAd, setPossibleBadges] = useState([
    {
      name: "Badge structure",
      description: "Avoir rejoint deux structure",
      src: badge1,
      hasTheBadge: false,
    },
    {
      name: "Badge 2",
      description: "Recommander l'application à 3 amis",
      src: badge2,
      hasTheBadge: false,
    },
    {
      name: "Badge 3",
      description: "Rejoindre une communauté de 10 adhérents",
      src: badge3,
      hasTheBadge: false,
    },
    {
      name: "Badge 4",
      description: "Avoir un impact co2 réduit de 10% entre deux évènements",
      src: badge4,
      hasTheBadge: false,
    },
  ]);

  useEffect(() => {
    async function checkJoinedStructure () {
      try{
        const serverAddress = getServerAddress();
        const resultStructure = await fetch(
          `${serverAddress}structures/adherent/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + myTokenAd,
            },
          }
        );
        if (resultStructure.ok) {
          const structuresData = await resultStructure.json();
          console.log("structuresData", structuresData);
          const joinedAStructure = structuresData.length >=2 ;
          setPossibleBadges((prevBadges) =>
          prevBadges.map((badge) =>
            badge.name === "Badge structure"
              ? { ...badge, hasTheBadge: joinedAStructure }
              : badge
          )
        );
        } else {
          console.error("Erreur lors de la récupération des structures");
          return false;
        }
      }
      catch (error) {
        console.error("Error checking joined structure:", error);
        return false;
      }
    };

    checkJoinedStructure();
  }, [getServerAddress, myAdherentId, myTokenAd]);



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