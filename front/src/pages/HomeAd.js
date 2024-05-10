import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";
import Sidebar from "../components/Sidebar";

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
  const navigate = useNavigate();

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
  }, [myTokenAd, myUserId, myToken]);

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
        console.log(myToken);
        console.error(
          "Erreur lors de la mise à jour du profil, code d'erreur:",
          resultToken.status
        );
        return;
      }

      const resultModificationContent = await resultToken.json();
      console.log(resultModificationContent);
      setShowForm(false);
      showInfos(); // Si showInfos() est défini ailleurs, sinon adapter cette ligne
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
    navigate("/homead");
  }

  const initPageLastUser = () => {
    if (Name === "" && FirstName === "") {
      setFirstName("CHANGER");
      setName("PRENOM");
    }
  };

  return (
    <div className="home-struct-ad">
      {initPageLastUser()}
      <Sidebar />
      <div className="content">
        <div className="name">
          <div className="profile-header">
            <h1 className="profile-title">
              {FirstName} {Name}
            </h1>
            <button className="edit-profile-button" onClick={handleClick}>
              Modifier
            </button>
          </div>
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
        <div className="impact-event-container">
          <div className="impact-section">
            <div className="title">
              <h2>Statistiques</h2>
            </div>
            TODO: Rajouter les statistiques ici
          </div>
          <div className="event-section">
            <div className="title">
              <h2>Badges</h2>
            </div>
            TODO: Rajouter les badges ici
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
