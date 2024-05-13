import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import { AuthStContext } from "../contexts/AuthSt";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";

const ListOfStructures = (props) => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { myTokenAd, setTokenAd, setUserIdAd, setFirstNameAd } = useContext(AuthAdContext);
  const { getServerAddress } = useContext(ServerContext);

  const {
    setTokenSt,
    setUserIdSt,
    setStructureId,
    setNameSt,
    setDateSt,
    loginSt
  } = useContext(AuthStContext);

  const navigate = useNavigate();
  const [structures, setStructures] = useState([]);
  const [showMinus, setShowMinus] = useState(false);

  useEffect(() => {
    const serverAddress = getServerAddress();

    // Fetch structures associated with the current user
    async function showStructures() {
      if (!myToken || !myUserId) return;

      const resultStructure = await fetch(
        serverAddress + "structures/user/" + myUserId,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myToken,
          },
        }
      );

      if (resultStructure.status !== 200) {
        console.log("Erreur lors de la récupération des structures");
        return;
      } else {
        const resultStructureContent = await resultStructure.json();
        if (resultStructureContent.length > 0) {
          setStructures(resultStructureContent);
        }
      }
    }

    showStructures();
  }, [getServerAddress, myToken, myUserId]);

  async function loginStructure(structureId, structureName, structureDate) {
    const serverAddress = getServerAddress();
    console.log(serverAddress + "structures/loginstruct");

    const resultLoginStructure = await fetch(
      serverAddress + "structures/loginstruct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + myToken,
        },
        body: JSON.stringify({
          structureId: structureId,
        }),
      }
    );

    if (resultLoginStructure.status !== 201) {
      console.log("Erreur lors de la connexion de la structure");
      return;
    } else {
      const resultLoginStructureContent = await resultLoginStructure.json();
      setTokenSt(resultLoginStructureContent.token);
      setUserIdSt(resultLoginStructureContent.userId);
      setStructureId(structureId);
      setNameSt(structureName);
      setDateSt(structureDate);
      loginSt();
      navigate("/homeStruct/" + structureName);
    }
  }

  const handleDeleteStruct = async (structureId) => {
    // Implementation for structure deletion can go here
  };

  const handleDeleteButton = () => {
    setShowMinus((prevShowMinus) => !prevShowMinus);
  };

  const delButton = (structure) => (
    <a className="ad-suppr-button" onClick={() => handleDeleteStruct(structure.id_structur)}>
      -
    </a>
  );

  return (
    <>
      <li className="manage-ad-str">
        Structures
        <a className="ad-add-button" onClick={() => navigate("/registerStructure")}>
          +
        </a>
        <a className="ad-suppr-button" onClick={() => handleDeleteButton()}>
          -
        </a>
      </li>
      {structures.map((structure) => (
        <li
          key={structure.id_structur}
          className="choose-adherant-container"
          onClick={() => {
            setTokenAd(null);
            setFirstNameAd("");
            setUserIdAd(null);
            loginStructure(structure.id_structur, structure.nom_structure, structure.date_creation);
          }}
        >
          <div className="ad-actions">
            <span className="id-ad">{structure.nom_structure}</span>
            <span className="suppr-ad">{showMinus && delButton(structure)}</span>
          </div>
        </li>
      ))}
    </>
  );
};

export default ListOfStructures;
