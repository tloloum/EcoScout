import React, { useContext, useEffect, useState } from "react";
import { ServerContext } from "../contexts/Server";

const ListOfBadges = () => {
  const { getServerAddress } = useContext(ServerContext);
  const [badges, setBadges] = useState([]);
  const badges_image = [
    { 
      id: 1,
      name: 'Badge 1',
      image: 'badge1.jpeg' // Assuming this is the filename of the image for Badge 1
    }]
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const serverAddress = getServerAddress();
        const response = await fetch(`${serverAddress}/badges`);
        if (!response.ok) {
          throw new Error('Failed to fetch badges');
        }
        const data = await response.json();
        setBadges(data);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };

    fetchBadges();
  }, [getServerAddress]);

  return (
    <div>
      <h2>List of Badges</h2>
      <ul>
      <img src={`/assets/img/${badges_image.image}`} alt={badges_image.name} />
            {badges.map((badge, index) => (
          <li key={index}>
            <img src={badge.image} alt={badge.name} />
            <span>{badge.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListOfBadges;
