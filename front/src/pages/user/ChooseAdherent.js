import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth";
import { AuthAdContext } from "../../contexts/AuthAd";
import { ServerContext } from "../../contexts/Server";

const ChooseAdherent = () => {
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

  const navigate = useNavigate();
  const [adherents, setAdherents] = useState([]);

  const [haveAd, sethaveAd] = useState(false);

  useEffect(() => {
    async function showAdherent() {
      if (!myToken || !myUserId) {
        return;
      }

      const serverAddress = getServerAddress();
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
          sethaveAd(true);
        }
      }
    }

    showAdherent();
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

  if (haveAd) {
    return (
      <div className="choose-adherant">
        <h2>Choisissez un adhérent</h2>
        <ul>
          {adherents.map((adherent) => (
            <li>
              <button
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
        </ul>
      </div>
    );
  } else {
    return (
      <div className="no-profile">
        <h2>Creer un nouveau Profil</h2>
        <button
          className="create-profile"
          onClick={() => navigate("/registerAdherent")}
        ></button>
      </div>
    );
  }
};

export default ChooseAdherent;
