import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth";
import { AuthAdContext } from "../../contexts/AuthAd";
import { ServerContext } from "../../contexts/Server";

const RegisterAdherent = () => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);
  const { setTokenAd, setUserIdAd, setAdherentId, loginAd } =
    useContext(AuthAdContext);

  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [ErreurMessage, setErreurMessage] = useState("");

  const handleNomChange = (event) => {
    setErreurMessage("");
    setNom(event.target.value);
  };

  const handlePrenomChange = (event) => {
    setErreurMessage("");
    setPrenom(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!myToken || !myUserId) {
      return;
    }

    const serverAddress = getServerAddress();
    console.log(serverAddress + "user/create-adherent");

    const resultAdherent = await fetch(serverAddress + "user/create-adherent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
      body: JSON.stringify({
        nom_ad: nom,
        prenom_ad: prenom,
      }),
    });

    if (resultAdherent.status !== 201) {
      setErreurMessage("Erreur lors de la création de l'adhérent");
      return;
    } else {
      navigate("/homead");
    }
  }

  return (
    <div className="register-adherent">
      <h2>Création d'un adhérent</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom :
          <input type="text" value={nom} onChange={handleNomChange} />
        </label>
        <label>
          Prénom :
          <input type="text" value={prenom} onChange={handlePrenomChange} />
        </label>
        <button type="submit">Créer</button>
      </form>
      <p>{ErreurMessage}</p>
    </div>
  );
};

export default RegisterAdherent;
