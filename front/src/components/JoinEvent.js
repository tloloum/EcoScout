import React, { useContext, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";

const JoinEvent = () => {
  const { getServerAddress } = useContext(ServerContext);

  const { myToken } = useContext(AuthContext);

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
    console.log(serverAddress + "/Events/" + idEvent + "/join/");

    // Recherche de la Event :
    const resultEvent = await fetch(
      serverAddress + "/Events/" + idEvent + "/join/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + myToken,
        },
        // body: JSON.stringify({
        //   id_structur: idEvent,
        // }),
      }
    );

    if (resultEvent.status !== 201) {
      console.log("Erreur lors de la création de la Event");
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
          Rejoindre une Event
        </button>
        {showForm && (
          <>
            <div className="darkBG" />
            <div className="centered">
              <div className="modal">
                <div className="modalHeader">
                  <h5 className="heading">Rejoindre une Event</h5>
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
                      Id de la Event:
                      <input
                        type="text"
                        name="name"
                        placeholder="insérer l'identifiant de la Event"
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
