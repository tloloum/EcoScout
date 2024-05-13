import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiCloseLine } from "react-icons/ri";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";
import Sidebar from "../components/Sidebar";
import ListOfAdherents from "../components/ListOfAdherents";

const HomeAd = () => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);
  const { setTokenAd, setUserIdAd, setAdherentId, loginAd, setFirstNameAd, myTokenAd, myAdherentId } = useContext(AuthAdContext);
  const [Name, setName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [newName, setNewName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [AdhId, setAdhId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const serverAddress = getServerAddress();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const response = await fetch(serverAddress + "user/" + myUserId + "/adherents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
    });

    if (!response.ok) {
      console.log("Erreur lors du chargement des informations");
      setIsLoading(false);
      return;
    }

    const adherents = await response.json();
    if (adherents && adherents.length > 0) {
      if (!myTokenAd) {
        setName(adherents[0].nom_ad);
        setFirstName(adherents[0].prenom_ad);
        setAdhId(adherents[0].id_adherent);
        handleFirstConnection(adherents[0].id_adherent);
      } else {
        for (let i = 0; i < adherents.length; i++) {
          if (adherents[i].id_adherent === myAdherentId) {
            setName(adherents[i].nom_ad);
            setFirstName(adherents[i].prenom_ad);
            setAdhId(adherents[i].id_adherent);
          }
        }
      }
    }
    setIsLoading(false);
  };


  useEffect(() => {
    if (!myToken || !myUserId) {
      navigate("/login"); // Rediriger si les identifiants ne sont pas disponibles
      return;
    }
    fetchUserDetails();
  }, [myToken, myTokenAd, navigate, serverAddress]);

  const handleFirstConnection = async (adherentId) => {
    const response = await fetch(serverAddress + "user/login-adherent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
      body: JSON.stringify({ adherentId }),
    });

    if (!response.ok) {
      console.error("Erreur lors de la connexion du profil, code d'erreur:", response.status);
      return;
    }

    const { token, userId } = await response.json();
    setTokenAd(token);
    setUserIdAd(userId);
    setAdherentId(adherentId);
    loginAd();
  };

  if (isLoading) {
    return <div className="chargement">Chargement...</div>;
  }

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
      fetchUserDetails();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
    }
    navigate("/homead");
  }


  return (
    <div className="home-struct-ad">
      <Sidebar />
      <div className="list-of-adherents-load">
        <ListOfAdherents />
      </div>
      <div className="content">
        <div className="name">
          <div className="profile-header">
            <h1 className="profile-title">
              {FirstName} {Name}
            </h1>
            <button className="edit-profile-button" onClick={() => setShowForm(true)}>
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

export default HomeAd;
