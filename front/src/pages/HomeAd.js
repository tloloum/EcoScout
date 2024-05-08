import React, { useContext, useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);
  const { myAdherentId, myTokenAd } = useContext(AuthAdContext);
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
  }, [myToken, myUserId]);

  const handleClick = () => {
    setShowForm(true);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setNewFirstName(event.target.value);
  };

  async function updateInfos(event) {
    event.preventDefault();
    let updatedValues = {};
    if (newName === "" || newFirstName === "") {
      console.log("Le nom et le prénom doivent être renseignés.");
      return;
    }
    updatedValues.nom_ad = newName;
    updatedValues.prenom_ad = newFirstName;
    try {
      const resultToken = await fetch(
        serverAddress + "user/" + myUserId + "/adherent/" + AdhId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myTokenAd,
          },
          body: JSON.stringify({
            id_adherent: AdhId,
            ...updatedValues,
          }),
        }
      );
  
      if (!resultToken.ok) {
        console.log(myToken)
        console.error("Erreur lors de la mise à jour du profil, code d'erreur:", resultToken.status);
        return;
      }
  
      const resultModificationContent = await resultToken.json();
      console.log(resultModificationContent);
      setShowForm(false);
      showInfos(); // Si showInfos() est défini ailleurs, sinon adapter cette ligne
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
  }
  

  return (
    <div className="container">
      <Sidebar />
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
                  <h5 className="heading">Modifier les informations du profil</h5>
                </div>
                <button
                  className="closeBtn"
                  onClick={() => setShowForm(false)}
                >
                  <RiCloseLine style={{ marginBottom: "-3px" }} />
                </button>
                <div className="modalContent">
                  <form onSubmit={updateInfos}>
                    <label>
                      Nouveau nom :
                      <input
                        type="text"
                        name="myName"
                        placeholder="Insérer le nom"
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
                        placeholder="Insérer le prénom"
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

