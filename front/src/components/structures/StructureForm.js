import React, { useState } from "react";

const StructureForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    date: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nom de la structure:
        <input
          type="text"
          name="name"
          placeholder="insérer le nom de la structure"
          value={formData.name}
          onChange={handleInputChange}
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
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Date de formation:
        <input
          type="date"
          name="date"
          placeholder="insérer la date de création"
          value={formData.date}
          onChange={handleInputChange}
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
  );
};

export default StructureForm;
