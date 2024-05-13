import React, { useContext, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { ServerContext } from "../contexts/Server";

const InfoStructure = () => {
  const { getServerAddress } = useContext(ServerContext);

  const [idStructure, setIdStructure] = useState("");
  const [nameStructure, setNameStructure] = useState("");
  const [dateStructure, setDateStructure] = useState("");

  const [showForm, setShowForm] = useState(false);

  const handleIdStructureChange = (event) => {
    setIdStructure(event.target.value);
  };

  const handleNameStructureChange = (event) => {
    setNameStructure(event.target.value);
  };

  const handleDateStructureChange = (event) => {
    setDateStructure(event.target.value);
  };

  const handleClick = () => {
    setShowForm(true);
  };

  async function structureSubmit(event) {
    event.preventDefault();
    const serverAddress = getServerAddress();
    console.log(serverAddress + "structures/" + idStructure);

    // Recherche de la structure :
    const resultStructure = await fetch(
      serverAddress + "structures/" + idStructure,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: "Bearer " + myToken,
        },
        body: JSON.stringify({
          nom_structure: nameStructure,
          date_creation: "2022-01-10", // dateStructure,
        }),
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
          Information d'une structure
        </button>
        {showForm && (
          <>
            <div className="darkBG" />
            <div className="centered">
              <div className="modal">
                <div className="modalHeader">
                  <h5 className="heading">Information d'une structure</h5>
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
                    <label>
                      Nom de la structure:
                      <input
                        type="text"
                        name="name"
                        placeholder="insérer le nom de la structure"
                        value={nameStructure}
                        onChange={handleNameStructureChange}
                      />
                    </label>
                    <br />
                    <label>
                      Date de formation:
                      <input
                        type="date"
                        name="date"
                        placeholder="insérer la date de création"
                        value={dateStructure}
                        onChange={handleDateStructureChange}
                      />
                    </label>
                    <br />
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

export default InfoStructure;
