import React, { useContext, useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";

const Profile = () => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);
  const [Name, setName] = useState("");
  const [FirstName, setFirstName] = useState("");

  const serverAddress = getServerAddress();

  async function showInfos() {
    if (!myToken || !myUserId) {
      return;
    }
    const resultInfos = await fetch(
      serverAddress + "user/" + myUserId + "/adherents",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + myToken,
        },
        // body: JSON.stringify({
        //   nom_ad: nom,
        //   prenom_ad: prenom,
        // }),
      }
    );

    if (resultInfos.status !== 200) {
      console.log("Erreur lors du chargement des informations");
      return;
    } else {
      const resultInfoContent = await resultInfos.json();
      console.log(resultInfoContent);
      setName(resultInfoContent[0].nom_ad);
      setFirstName(resultInfoContent[0].prenom_ad);
    }
  }

  useEffect(() => {
    showInfos();
  });

  return (
    <div>
      <Navigation />
      <div className="profil">
        <h1>Profil</h1>
        <div className="profil-container">
          <div className="profil-presentation">
            <p>Nom : {Name}</p>
            <p>Prenom : {FirstName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
