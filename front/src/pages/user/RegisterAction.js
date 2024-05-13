import React, { useState } from "react";
import "./RegisterAction.css";

const RegisterAction = () => {
  const [description, setDescription] = useState("");
  const [impact, setImpact] = useState("");
  const [erreurMessage, setErreurMessage] = useState("");

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImpactChange = (event) => {
    setImpact(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/actions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // You may need to include authorization headers if required by your backend
      },
      body: JSON.stringify({
        description: description,
        impact: impact,
      }),
    });

    if (!response.ok) {
      setErreurMessage("Erreur lors de l'enregistrement de l'action");
      return;
    }

    setDescription("");
    setImpact("");
    setErreurMessage("");
  };

  return (
    <div className="register-action">
      <h2>Register Ecological Action</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Description:
          <textarea value={description} onChange={handleDescriptionChange} />
        </label>
        <br />
        <label>
          Impact:
          <input type="text" value={impact} onChange={handleImpactChange} />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      <p>{erreurMessage}</p>
    </div>
  );
};

export default RegisterAction;
