import React, { useContext, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";
import StructureForm from "./StructureForm";

const Create = () => {
  const { getServerAddress } = useContext(ServerContext);
  const { myToken } = useContext(AuthContext);

  const [showForm, setShowForm] = useState(false);
  const serverAddress = getServerAddress();

  const onSubmit = async (formData) => {
    // Handle form submission logic, including API request
    try {
      const response = await fetch(`${serverAddress}/structures/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${myToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Handle successful response
      } else {
        // Handle error response
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClick = () => {
    setShowForm(true);
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
                  setShowForm(false);
                }}
              >
                <RiCloseLine style={{ marginBottom: "-3px" }} />
              </button>
              <div className="modalContent">
                <StructureForm onSubmit={onSubmit} />
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Create;
