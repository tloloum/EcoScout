import React, { useContext, useEffect, useState } from "react";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";

const StatAd = () => {
  const { getServerAddress } = useContext(ServerContext);
  const { myTokenAd } = useContext(AuthAdContext);
  const [totalImpact, setTotalImpact] = useState(0);
  const [displayedImpact, setDisplayedImpact] = useState(0);

  async function getAllImpactAd() {
    try {
      const serverAddress = getServerAddress();
      const resultImpact = await fetch(`${serverAddress}impact/get/totalad`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${myTokenAd}`,
        },
      });

      if (resultImpact.ok) {
        const resultImpactContent = await resultImpact.json();
        setTotalImpact(resultImpactContent.impact);
        console.log("Total impact :", resultImpactContent.impact);
      } else {
        console.error("Erreur lors de la récupération des informations.");
      }
    } catch (err) {
      console.error("Erreur :", err);
    }
  }

  useEffect(() => {
    getAllImpactAd();
  }, [myTokenAd, getServerAddress]);

  useEffect(() => {
    setDisplayedImpact(0);
    let interval = null;
    if (totalImpact > 0 && displayedImpact < totalImpact) {
      interval = setInterval(() => {
        setDisplayedImpact((prev) => {
          if (prev < totalImpact) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 10);
    }
    return () => clearInterval(interval);
  }, [totalImpact]);

  return (
    <div className="stat-container">
      <h1>Impact Écologique Total</h1>
      <div className="impact-value">{displayedImpact} kgCO2</div>
    </div>
  );
};

export default StatAd;
