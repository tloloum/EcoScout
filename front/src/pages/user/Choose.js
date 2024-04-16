import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth";
import { AuthAdContext } from "../../contexts/AuthAd";
import { AuthStContext } from "../../contexts/AuthSt";
import { ServerContext } from "../../contexts/Server";

const Choose = () => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);
  const {
    setTokenAd,
    setUserIdAd,
    setAdherentId,
    loginAd,
    setNameAd,
    setFirstNameAd,
  } = useContext(AuthAdContext);
  const {
    setTokenSt,
    setUserIdSt,
    setStructureId,
    loginSt,
    setNameSt,
    setDateSt,
  } = useContext(AuthStContext);

  const navigate = useNavigate();
  const [adherents, setAdherents] = useState([]);
  const [structures, setStructures] = useState([]);

  useEffect(() => {
    const serverAddress = getServerAddress();

    // Partie recherche des Adherents

    async function showAdherents() {
      if (!myToken || !myUserId) {
        return;
      }

      console.log(serverAddress + "user/" + myUserId + "/adherents");

      const resultAdherent = await fetch(
        serverAddress + "user/" + myUserId + "/adherents",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myToken,
          },
        }
      );

      if (resultAdherent.status !== 200) {
        console.log("Erreur lors de la récupération des adhérents");
        return;
      } else {
        const resultAdherentContent = await resultAdherent.json();
        console.log(resultAdherentContent);
        if (resultAdherentContent.length > 0) {
          setAdherents(resultAdherentContent);
          //sethaveAd(true);
        }
      }
    }

    // Partie recherche des Structures

    async function showStructures() {
      if (!myToken || !myUserId) {
        return;
      }

      const resultStructure = await fetch(
        serverAddress + "structures/user/" + myUserId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myToken,
          },
        }
      );

      if (resultStructure.status !== 200) {
        console.log("Erreur lors de la récupération des structures");
        return;
      } else {
        const resultStructureContent = await resultStructure.json();
        console.log(resultStructureContent);
        if (resultStructureContent.length > 0) {
          setStructures(resultStructureContent);
        }
      }
    }

    showAdherents();
    showStructures();
  }, [myToken, myUserId]);

  async function loginAdherent(adherentId) {
    const serverAddress = getServerAddress();
    console.log(serverAddress + "user/login-adherent");

    const resultLoginAdherent = await fetch(
      serverAddress + "user/login-adherent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + myToken,
        },
        body: JSON.stringify({
          adherentId: adherentId,
        }),
      }
    );

    if (resultLoginAdherent.status !== 200) {
      console.log("Erreur lors de la connexion de l'adhérent");
      return;
    } else {
      /* Les fonctions de AuthAd ne sont pas activé*/
      console.log("erreur");
      const resultLoginAdherentContent = await resultLoginAdherent.json();
      setTokenAd(resultLoginAdherentContent.token);
      setUserIdAd(resultLoginAdherentContent.userId);
      setAdherentId(adherentId);
      loginAd();
      navigate("/home");
    }
  }

  async function loginStructure(structureId) {
    const serverAddress = getServerAddress();
    console.log(serverAddress + "structures/loginstruct");

    const resultLoginStructure = await fetch(
      serverAddress + "structures/loginstruct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + myToken,
        },
        body: JSON.stringify({
          structureId: structureId,
        }),
      }
    );

    if (resultLoginStructure.status !== 200) {
      console.log("Erreur lors de la connexion de la structure");
      return;
    } else {
      /* Les fonctions de AuthSt ne sont pas activé*/
      console.log("erreur");
      const resultLoginStructureContent = await resultLoginStructure.json();
      setTokenSt(resultLoginStructureContent.token);
      setUserIdSt(resultLoginStructureContent.userId);
      setStructureId(structureId);
      loginSt();
      navigate("/home");
    }
  }

  // if (haveAd) {
  return (
    <div>
      <div className="choose-adherant">
        <h2>Choisissez un adhérent</h2>
        <ul>
          {adherents.map((adherent) => (
            <li>
              <button
                className="choose-adherant-container"
                onClick={() => {
                  console.log("Selection");
                  setNameAd(adherent.nom_ad);
                  setFirstNameAd(adherent.prenom_ad);
                  console.log("22222");
                  loginAdherent(adherent.id_adherent);
                }}
              >
                {adherent.nom_ad} {adherent.prenom_ad}
              </button>
            </li>
          ))}
          <li>
            <button
              className="choose-adherant-container"
              id="create-profile"
              onClick={() => navigate("/registerAdherent")}
            ></button>
          </li>
        </ul>
      </div>
      <div className="choose-adherant">
        <h2>Choisissez une structure</h2>
        <ul>
          {structures.map((structure) => (
            <li>
              <button
                className="choose-adherant-container"
                onClick={() => {
                  console.log("Selection");
                  setNameSt(structure.nom_structure);
                  setDateSt(structure.date_creation);
                  console.log("22222");
                  loginStructure(structure.id_structur);
                }}
              >
                {structure.nom_structure}
              </button>
            </li>
          ))}
          <li>
            <button
              className="choose-adherant-container"
              id="create-profile"
              onClick={() => navigate("/registerStructure")}
            ></button>
          </li>
        </ul>
      </div>
    </div>
  );
  // }
  // else {
  //   return (
  //     <div className="no-profile">
  //       {/* <div className="no-profile"> */}
  //       <h2>Creer un nouveau Profil</h2>
  //       <button
  //         id="create-profile"
  //         onClick={() => navigate("/registerAdherent")}
  //       ></button>
  //     </div>
  //   );
  // }
};

export default Choose;
