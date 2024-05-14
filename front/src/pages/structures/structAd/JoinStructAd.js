import React, { useContext } from "react";
import { AuthAdContext } from "../../../contexts/AuthAd";
import { ServerContext } from "../../../contexts/Server";
import SearchStruct from "../../../components/structures/SearchStruct";
import Sidebar from "../../../components/Sidebar";

const JoinStructAd = () => {
  const { getServerAddress } = useContext(ServerContext);
  const { myAdherentId, myTokenAd } = useContext(AuthAdContext);

  //Fonction pour demander à join une structure en temps qu'adhérent.
  const structureSubmit = async (idStructure) => {
    const serverAddress = getServerAddress();
    const resultStructure = await fetch(
      serverAddress +
        "structures/demand/" +
        idStructure +
        "/adherent/" +
        myAdherentId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + myTokenAd,
        },
      }
    );
    if (resultStructure.status !== 201) {
      console.log(
        "Erreur lors de la demande de join, code d'erreur:" +
          resultStructure.status
      );
    }
    return;
  };
  return (
    <div>
      <div className="home-struct-ad">
        <Sidebar />
      </div>
      <SearchStruct structureSubmit={structureSubmit} />
    </div>
  );
};

export default JoinStructAd;
