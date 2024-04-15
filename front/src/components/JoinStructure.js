import React, { useContext, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";

const JoinStructure = () => {
  const { getServerAddress } = useContext(ServerContext);

  const { myToken } = useContext(AuthContext);

  const [idStructure, setIdStructure] = useState("");

  const [showForm, setShowForm] = useState(false);

  const handleIdStructureChange = (event) => {
    setIdStructure(event.target.value);
  };

  const handleClick = () => {
    setShowForm(true);
  };

  async function structureSubmit(event) {
    event.preventDefault();
    const serverAddress = getServerAddress();
    console.log(serverAddress + "structures");

    // Recherche de la structure :
    const resultStructure = await fetch(
      serverAddress + "structures/" + idStructure,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + myToken,
        },
        // body: JSON.stringify({
        //   id_structur: idStructure,
        // }),
      }
    );

    if (resultStructure.status !== 201) {
      console.log("Erreur lors de la création de la structure");
      return;
    } else {
      console.log(serverAddress + "structures");
      const resultStructureContent = await resultStructure.json();
      console.log(resultStructureContent);
    }

    setShowForm(false);
  }

  return (
    <div>
      <main>
        <button className="primaryBtn" onClick={handleClick}>
          Rejoindre une structure
        </button>
        {showForm && (
          <>
            <div className="darkBG" />
            <div className="centered">
              <div className="modal">
                <div className="modalHeader">
                  <h5 className="heading">Créer une structure</h5>
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
                  <form onSubmit={structureSubmit}>
                    <label>
                      Id de la structure:
                      <input
                        type="text"
                        name="name"
                        placeholder="insérer l'identifiant de la structure"
                        value={idStructure}
                        onChange={handleIdStructureChange}
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
      </main>
    </div>
  );
};

export default JoinStructure;
