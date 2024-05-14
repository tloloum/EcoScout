import React, { useContext } from "react";
import BadgesSt from "../../components/Badges/BadgesSt";
import Sidebar from "../../components/Sidebar";
import { AuthStContext } from "../../contexts/AuthSt";

const Badges = () => {
  const { myStructureId, myTokenSt } = useContext(AuthStContext);
  if (myStructureId) {
    return (
      <div className="home-ad">
      <Sidebar />
      <div className="content">
            <div className="stat-badge">
              
              <div className="badges-section">
                <div className="title">
                  <h2>Badges</h2>
                </div>
                <BadgesSt />
              </div>
            </div>
          </div>
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
