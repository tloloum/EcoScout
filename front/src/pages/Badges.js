import React from "react";
import BadgesAd from "../components/BadgesAd";
import Sidebar from "../components/Sidebar";

const Badges = () => {
  return (
    <div className="container">
      <Sidebar />
      <h1>Badges</h1>
      <BadgesAd />
    </div>
  );
};

export default Badges;
