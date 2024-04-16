import React, { useContext, useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import Navigation from "../components/Navigation";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";

const Profile = () => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);
  const { myAdherentId } = useContext(AuthAdContext);
  const [Name, setName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [newName, setNewName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [AdhId, setAdhId] = useState("");
  const [showForm, setShowForm] = useState(false);

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
      }
    );

    if (resultInfos.status !== 200) {
      console.log("Erreur lors du chargement des informations");
      return;
    } else {
      const resultInfoContent = await resultInfos.json();
      console.log(resultInfoContent);

      for (let i = 0; i < resultInfoContent.length; i++) {
        if (resultInfoContent[i].id_adherent === myAdherentId) {
          setName(resultInfoContent[i].nom_ad);
          setFirstName(resultInfoContent[i].prenom_ad);
          setAdhId(resultInfoContent[i].id_adherent);
        }
      }
    }
  }

  useEffect(() => {
    showInfos();
  });

  const handleClick = () => {
    setShowForm(true);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setNewFirstName(event.target.value);
  };

  async function updateInfos() {
    // TODO : Bug à réparer lors de la mise à jour du profil

    console.log(`Nouveau nom : ${newName}`);
    console.log(`Nouveau nom : ${newFirstName}`);

    const resultToken = await fetch(
      serverAddress + "user/" + myUserId + "/adherent/" + AdhId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + myToken,
        },
        body: JSON.stringify({
          id_adherent: AdhId,
          nom_ad: newName,
          prenom_ad: newFirstName,
        }),
      }
    );

    if (resultToken.status !== 201) {
      console.log("Identifiant ou mot de passe incorrect");
      return;
    } else {
      const resultModificationContent = await resultToken.json();
      console.log(resultModificationContent);
    }
    setShowForm(false);
  }

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
        <button onClick={handleClick}>Mettre à jour les informations</button>
        {showForm && (
          <>
            <div className="darkBG" />
            <div className="centered">
              <div className="modal">
                <div className="modalHeader">
                  <h5 className="heading">
                    Modifier les informations du profil
                  </h5>
                </div>
                <button
                  className="closeBtn"
                  onClick={() => {
                    //handleUndo();
                    setShowForm(false);
                  }}
                >
                  <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className="modalContent">
                  <form onSubmit={updateInfos}>
                    {/* {handleSubmit(onSubmit)}> */}
                    <label>
                      Nouveau nom :
                      <input
                        type="text"
                        name="myName"
                        placeholder="insérer le nom"
                        value={newName}
                        onChange={handleNameChange}
                      />
                    </label>
                    <br />
                    <label>
                      Nouveau prenom :
                      <input
                        type="text"
                        name="myFirstName"
                        placeholder="insérer le prenom"
                        value={newFirstName}
                        onChange={handleFirstNameChange}
                      />
                    </label>
                    <br />
                    <div className="modalActions">
                      <div className="actionsContainer">
                        <button type="submit" className="submitBtn">
                          Soumettre
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
