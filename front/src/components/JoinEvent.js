import React, { useContext, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";

const JoinEvent = () => {
  const { getServerAddress } = useContext(ServerContext);

  const { myToken } = useContext(AuthContext);
  const { myTokenAd } = useContext(AuthAdContext);
  const [idEvent, setIdEvent] = useState("");

  const [showForm, setShowForm] = useState(false);

  const handleIdEventChange = (event) => {
    setIdEvent(event.target.value);
  };

  const handleClick = () => {
    setShowForm(true);
  };

  async function EventSubmit(event) {
    event.preventDefault();
    const serverAddress = getServerAddress();
    console.log(serverAddress + "events/join" + idEvent);

    //Rejoindre un événement (depuis le token d'authentification adhérent)
    // isn't idEvent supposed to be generated by the bdd ?
    const resultEvent = await fetch(serverAddress + "events/join" + idEvent, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myTokenAd,
      },
      body: JSON.stringify({
        eventID: idEvent,
      }),
    });

    if (resultEvent.status !== 201) {
      console.log("Erreur lors de la création de l'évènement");
      return;
    } else {
      console.log(serverAddress + "Events");
      const resultEventContent = await resultEvent.json();
      console.log(resultEventContent);
    }

    setShowForm(false);
  }

  return (
    <div>
      <main>
        <button className="primaryBtn" onClick={handleClick}>
          Rejoindre un évènement
        </button>
        {showForm && (
          <>
            <div className="darkBG" />
            <div className="centered">
              <div className="modal">
                <div className="modalHeader">
                  <h5 className="heading">Rejoindre un évènement</h5>
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
                  <form onSubmit={EventSubmit}>
                    <label>
                      Id de l'évènement:
                      <input
                        type="text"
                        name="name"
                        placeholder="insérer l'identifiant de l'évènement"
                        value={idEvent}
                        onChange={handleIdEventChange}
                      />
                    </label>
                    <br />
                    <div className="modalActions">
                      <div className="actionsContainer">
                        <button
                          type="submit"
                          className="submitBtn"
                          // onClick={() => {
                          //   //handleUndo();
                          //   setShowForm(false);
                          // }}
                        >
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
      </main>
    </div>
  );
};

export default JoinEvent;