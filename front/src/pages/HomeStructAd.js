import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthAdContext } from "../contexts/AuthAd";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";
import Sidebar from "../components/Sidebar";

const HomeStructAd = () => {
  const { name: structName } = useParams();
  const { getServerAddress } = useContext(ServerContext);
  const { myTokenAd } = useContext(AuthAdContext);
  const { myToken } = useContext(AuthContext);
  const [structInfo, setStructInfo] = useState({});

  // Fetch structure info
  const fetchStructuresInfo = async () => {
    const serverAddress = getServerAddress();
    const response = await fetch(
      `${serverAddress}structures/searchstruct/${structName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${myToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setStructInfo(data);
    } else {
      console.error("Failed to fetch structures");
    }
  };

  // Fetch info on component mount
  useEffect(() => {
    fetchStructuresInfo();
  }, [structName]);

  return (
    <div className="home-struct-ad">
      <Sidebar />
      <div className="content">
        <h1>{structInfo.nom_structure}</h1>
        <div className="non-structure">
          <div className="impact-section">
            <h2>Impacts</h2>
            <ul>
              Impact
            </ul>  
            <button onClick={() => console.log("add impact")}>Rajouter un impact</button>
          </div>
          <div className="event-section">
            <h2>Events</h2>
            <ul>
                Events
            </ul>
          </div>
        </div>
        <div className="list-members">
          <h2>Liste des membres</h2>
          {/* Add your list of members here */}
        </div>
      </div>
    </div>
  );
};

export default HomeStructAd;
