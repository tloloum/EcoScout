import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth";
import { ServerContext } from "../../contexts/Server";

const RegisterEvent = () => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);

  const navigate = useNavigate();

  const [nameEvent, setNameEvent] = useState("");
  const [locationEvent, setlocationEvent] = useState("");
  const [dateEvent, setDateEvent] = useState("");
  const [dureeEvent, setDureeEvent] = useState("");
  const [ErreurMessage, setErreurMessage] = useState("");
  const [descriptionEvent, setDescriptionEvent] = useState("");

  const handleNameEventChange = (event) => {
    setErreurMessage("");
    setNameEvent(event.target.value);
  };

  const handlelocationEventChange = (event) => {
    setErreurMessage("");
    setlocationEvent(event.target.value);
  };

  const handleDateEventChange = (event) => {
    setErreurMessage("");
    setDateEvent(event.target.value);
  };

  const handleDescriptionEventChange = (event) => {
    setDescriptionEvent(event.target.value);
  };

  const handleDureeEventChange = (event) => {
    setErreurMessage("");
    setDureeEvent(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!myToken || !myUserId) {
      console.log("Error with user token or id");
      return;
    }

    const serverAddress = getServerAddress();
    console.log(serverAddress + "Events/create");

    const resultEvent = await fetch(serverAddress + "Events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myToken,
      },
      body: JSON.stringify({
        nom_Event: nameEvent,
        date_creation: dateEvent,
      }),
    });

    if (resultEvent.status !== 201) {
      console.log(resultEvent);
      setErreurMessage("Erreur lors de la création de l'évènement");
      return;
    } else {
      navigate("/choose");
    }
  }

  return (
    <div className="register-adherent">
      <h2>Création d'une Event</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Nom de l'évènement:
          <input
            type="text"
            name="name"
            placeholder="insérer le nom de l'évènement'"
            value={nameEvent}
            onChange={handleNameEventChange}
          />
        </label>
        <br />
        <label>
          Description de l'évènement:
          <textarea
            name="description"
            placeholder="Ajouter une description de l'évènement"
            value={descriptionEvent}
            onChange={handleDescriptionEventChange}
          />
        </label>
        <br />
        <label>
          le lieu:
          <input
            // {...register("location", {
            //   required: " Ce champ est obligatoire",
            // })}
            type="location"
            name="location"
            placeholder="insérer le lieu"
            value={locationEvent}
            onChange={handlelocationEventChange}
          />
        </label>
        <br />
        <label>
          Date de formation:
          <input
            // {...register("date")}
            type="date"
            name="date"
            placeholder="insérer la date de l'évènement"
            value={dateEvent}
            onChange={handleDateEventChange}
          />
        </label>
        <br />
        <label>
          Durée (en heures):
          <input
            type="text"
            name="duree"
            placeholder="Insérer la durée en heures"
            value={dureeEvent}
            onChange={handleDureeEventChange}
          />
        </label>
        <button type="submit">Créer</button>
      </form>

      <p>{ErreurMessage}</p>
    </div>
  );
};

export default RegisterEvent;
