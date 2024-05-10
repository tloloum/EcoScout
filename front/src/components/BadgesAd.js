import React from "react";
import badge1 from "../assets/img/badge.jpeg";

const BadgesAd = () => {
  const PossibleBadgesAd = [
    {
      name: "Badge 1",
      description: "Avoir participé à 3 évènements",
      src: badge1,
    },
    {
      name: "Badge 2",
      description: "condition d'obtention du badge 2",
      src: "",
    },
    {
      name: "Badge 3",
      description: "condition d'obtention du badge 3",
      src: "",
    },
    {
      name: "Badge 4",
      description: "condition d'obtention du badge ",
      src: "",
    },
  ];

  return (
    <div>
      <div className="badges-list">
        {PossibleBadgesAd.map((badge, index) => (
          <div key={index} className="badge-item">
            <img src={badge.src} alt={badge.name} />
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
