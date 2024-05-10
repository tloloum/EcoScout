import React from "react";
import badge1 from "../assets/img/badge.jpeg";
import badge2 from "../assets/img/badge2.jpeg";

const BadgesAd = () => {
  const PossibleBadgesAd = [
    {
      name: "Badge 1",
      description: "Avoir participé à 3 évènements",
      src: badge1,
      hasTheBadge: false,
    },
    {
      name: "Badge 2",
      description: "condition d'obtention du badge 2",
      src: badge2,
      hasTheBadge: true,
    },
    {
      name: "Badge 3",
      description: "condition d'obtention du badge 3",
      src: "",
      hasTheBadge: false,
    },
    {
      name: "Badge 4",
      description: "condition d'obtention du badge ",
      src: "",
      hasTheBadge: false,
    },
  ];
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
