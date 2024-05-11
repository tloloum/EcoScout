import React, { useContext } from "react";
import BadgesAd from "../components/BadgesAd";
import BadgesSt from "../components/BadgesSt";
import Sidebar from "../components/Sidebar";
import { AuthAdContext } from "../contexts/AuthAd";
import { AuthStContext } from "../contexts/AuthSt";

const Badges = () => {
  const { myStructureId, myTokenSt } = useContext(AuthStContext);
  const { myAdherentId, myTokenAd } = useContext(AuthAdContext);
  if (myStructureId) {
    return (
      <div className="home-struct-ad">
        <Sidebar />
        <h1>Badges</h1>
        <BadgesSt />
      </div>
    );
  } else if (myAdherentId) {
    return (
      <div className="home-struct-ad">
        <Sidebar />
        <h1>Badges</h1>
        <BadgesAd />
      </div>
    );
  } else {
    return (
      <div className="home-struct-ad">
        <Sidebar />
        <h1>Badges</h1>
        <h2>
          Connectez-vous à un compte adhérent/structure pour voir vos badges
        </h2>
      </div>
    );
  }
};

export default Badges;
