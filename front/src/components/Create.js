import React, { useState } from "react";
import { RiCloseLine } from "react-icons/ri";

const Create = () => {
  const [showForm, setShowForm] = useState(false);
  const handleClick = () => {
    setShowForm(true);
  };
  const defaultFormData = {
    name: "",
    region: "",
    date: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleUndo = () => {
    setFormData(defaultFormData);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleUndo();
    setShowForm(false);
  };
  return (
    <main>
      <button className="primaryBtn" onClick={handleClick}>
        Créer une structure
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
                  handleUndo();
                  setShowForm(false);
                }}
              >
                <RiCloseLine style={{ marginBottom: "-3px" }} />
              </button>
              <div className="modalContent">
                <form onSubmit={handleSubmit}>
                  <label>
                    Nom de la structure:
                    <input
                      type="text"
                      name="name"
                      placeholder="insérer le nom de la structure"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <br />
                  <label>
                    La région:
                    <input
                      type="region"
                      name="region"
                      placeholder="insérer la région"
                      value={formData.region}
                      onChange={handleChange}
                    />
                  </label>
                  <br />
                  <label>
                    Date de formation:
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </label>
                  <br />
                </form>
              </div>
              <div className="modalActions">
                <div className="actionsContainer">
                  <button className="submitBtn" onClick={handleSubmit}>
                    Soumettre
                  </button>
                  <button className="undoBtn" onClick={handleUndo}>
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Create;
