import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";

const ListOfAdherents = (props) => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);
  const { setTokenAd, setUserIdAd, setAdherentId, loginAd, setFirstNameAd} =
    useContext(AuthAdContext);

  const navigate = useNavigate();
  const [adherents, setAdherents] = useState([]);
  
  useEffect(() => {
    const serverAddress = getServerAddress();

    async function fetchAdherents() {
      if (!myToken || !myUserId) {
        return;
      }

      const resultAdherent = await fetch(
        `${serverAddress}user/${myUserId}/adherents`,
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
      }

      const resultAdherentContent = await resultAdherent.json();
      if (resultAdherentContent.length > 0) {
        setAdherents(resultAdherentContent);
      }
    }

    fetchAdherents();
  }, [getServerAddress, myToken, myUserId]);

  const loginAdherent = async (adherentId, prenom) => {
    const serverAddress = getServerAddress();

    const resultLoginAdherent = await fetch(
      `${serverAddress}user/login-adherent`,
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
    }

    const resultLoginAdherentContent = await resultLoginAdherent.json();
    setTokenAd(resultLoginAdherentContent.token);
    setUserIdAd(resultLoginAdherentContent.userId);
    setFirstNameAd(prenom);
    setAdherentId(adherentId);
    loginAd();
    navigate("/homead");
  };

  const handleDeleteAdherent = async (adherentId) => {
    console.log("Suppression de l'adhérent " + adherentId + myToken);
    const serverAddress = getServerAddress();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet adhérent ?")) {
      const result = await fetch(
        `${serverAddress}user/${myUserId}/adherent/${adherentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myToken,
          },
        }
      );
      console.log(result.status);
      if (result.status === 200) {
        // Remove the deleted adherent from the local state
        setAdherents((prevAdherents) =>
          prevAdherents.filter(
            (adherent) => adherent.id_adherent !== adherentId
          )
        );
      } else {
        console.log("Erreur lors de la suppression de l'adhérent");
      }
    }
    if (adherents.length === 1) {
      navigate("/registerAdherent");
    } else {
      loginAdherent(adherents[0].id_adherent, adherents[0].prenom_ad);
    }
  };


  const [showMinus, setShowMinus] = useState(false);

  const handleDeleteButton = () => {
    // Afficher ou masquer le "-" après chaque nom d'adhérent
    setShowMinus(prevShowMinus => !prevShowMinus);
  };

  const delButton =  (adherent) => (<a className="ad-suppr-button" onClick={() => handleDeleteAdherent(adherent.id_adherent)}>-</a>)

  return (
    <>
    <li className="manage-ad-str">
        Adhérents 
        <a className="ad-add-button" onClick={() => navigate("/registerAdherent")}>+</a>
        <a className="ad-suppr-button" onClick={() => handleDeleteButton()}>-</a>
      </li>
      {adherents.map((adherent) => (
        <li key={adherent.id_adherent}
            className="choose-adherant-container"
            onClick={() => {
              loginAdherent(adherent.id_adherent, adherent.prenom_ad);
            }}
          >
            {adherent.nom_ad} {adherent.prenom_ad} {showMinus && delButton(adherent)}
        </li>
      ))}
      {/* {newAdherent()} */}
    </>
  );
};

export default ListOfAdherents;
