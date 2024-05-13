import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth";
import { ServerContext } from "../../contexts/Server";
import Sidebar from "../../components/Sidebar";

const RegisterStructure = () => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);

  const navigate = useNavigate();

  const [nameStructure, setNameStructure] = useState("");
  const [regionStructure, setRegionStructure] = useState("");
  const [dateStructure, setDateStructure] = useState("");
  const [ErreurMessage, setErreurMessage] = useState("");
  const [descriptionStructure, setDescriptionStructure] = useState("");

  const handleNameStructureChange = (event) => {
    setErreurMessage("");
    setNameStructure(event.target.value);
  };

  const handleRegionStructureChange = (event) => {
    setErreurMessage("");
    setRegionStructure(event.target.value);
  };

  const handleDateStructureChange = (event) => {
    setErreurMessage("");
    setDateStructure(event.target.value);
  };

  const handleDescriptionStructureChange = (event) => {
    setDescriptionStructure(event.target.value);
  };
  async function handleSubmit(event) {
    event.preventDefault();
    if (!myToken || !myUserId) {
      console.log("Error with user token or id");
      return;
    }

    const serverAddress = getServerAddress();
    console.log(serverAddress + "structures/create");

    const resultStructure = await fetch(serverAddress + "structures/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
      body: JSON.stringify({
        nom_structure: nameStructure,
        date_creation: dateStructure,
      }),
    });
    // const resultAdherent = await fetch(serverAddress + "user/create-adherent", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + myToken,
    //   },
    //   body: JSON.stringify({
    //     nom_ad: nom,
    //     prenom_ad: prenom,
    //   }),
    // });

    if (resultStructure.status !== 201) {
      console.log(resultStructure);
      setErreurMessage("Erreur lors de la création de la structure");
      return;
    } else {
      navigate("/homestruct");
    }
  }

  return (
    <div className="register-adherent">
      <Sidebar />
      <h2>Création d'une structure</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Nom de la structure:
          <input
            // {...register("name", {
            //   required: "Ce champ est obligatoire",
            // })}
            type="text"
            name="name"
            placeholder="insérer le nom de la structure"
            value={nameStructure}
            onChange={handleNameStructureChange}
          />
          {/* {errors.region && (
          <span className="errorMsg">{errors.name.message}</span>
        )} */}
        </label>
        {/* <p className="errorMsg">{errors.name?.message}</p> */}
        <br />
        <label>
          Description de la structure:
          <textarea
            name="description"
            placeholder="Ajouter une description de la structure"
            value={descriptionStructure}
            onChange={handleDescriptionStructureChange}
          />
        </label>
        <br />
        <label>
          La région:
          <input
            // {...register("region", {
            //   required: " Ce champ est obligatoire",
            // })}
            type="region"
            name="region"
            placeholder="insérer la région"
            value={regionStructure}
            onChange={handleRegionStructureChange}
          />
          {/* {errors.region && (
          <span className="errorMsg">{errors.region.message}</span>
        )} */}
        </label>
        {/* <p className="errorMsg">{errors.name?.message}</p> */}
        <br />
        <label>
          Date de formation:
          <input
            // {...register("date")}
            type="date"
            name="date"
            placeholder="insérer la date de création"
            value={dateStructure}
            onChange={handleDateStructureChange}
          />
        </label>
        <button type="submit">Créer</button>
        {/* <br />
        <div className="modalActions">
          <div className="actionsContainer">
            <button
              type="submit"
              className="submitBtn"
              // onClick={structureSubmit(handleSubmit(onSubmit))}
            >
              Soumettre
            </button>
            <button
            className="undoBtn"
            onClick={handleUndo}
          >
            Annuler
          </button>
          </div>
        </div> */}
      </form>

      {/* <form onSubmit={handleSubmit}>
        <label>
          Nom :
          <input type="text" value={nom} onChange={handleNomChange} />
        </label>
        <label>
          Prénom :
          <input type="text" value={prenom} onChange={handlePrenomChange} />
        </label>
        <button type="submit">Créer</button>
      </form> */}
      <p>{ErreurMessage}</p>
    </div>
  );
};

export default RegisterStructure;
