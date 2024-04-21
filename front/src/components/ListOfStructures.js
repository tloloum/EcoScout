import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import { AuthStContext } from "../contexts/AuthSt";
import { ServerContext } from "../contexts/Server";

const ListOfStructures = (props) => {
  const { myToken, myUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);

  const {
    setTokenSt,
    setUserIdSt,
    setStructureId,
    loginSt,
    setNameSt,
    setDateSt,
  } = useContext(AuthStContext);

  const navigate = useNavigate();
  const [structures, setStructures] = useState([]);

  useEffect(() => {
    const serverAddress = getServerAddress();

    // Partie recherche des Structures

    async function showStructures() {
      if (!myToken || !myUserId) {
        return;
      }

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
        // console.log(resultStructureContent);
        if (resultStructureContent.length > 0) {
          setStructures(resultStructureContent);
        }
      }
    }

    showStructures();
  }, [getServerAddress, myToken, myUserId]);

  async function loginStructure(structureId) {
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
      // console.log(resultLoginStructure.status);
      return;
    } else {
      const resultLoginStructureContent = await resultLoginStructure.json();
      setTokenSt(resultLoginStructureContent.token);
      setUserIdSt(resultLoginStructureContent.userId);
      setStructureId(structureId);
      loginSt();
      navigate("/home");
    }
  }

  const newStructure = () => {
    const buttonNew = props.buttonNew;

    if (buttonNew === true) {
      return (
        <li>
          <button
            className="choose-adherant-container"
            id="create-profile"
            onClick={() => navigate("/registerStructure")}
          ></button>
        </li>
      );
    } else {
      return;
    }
  };

  return (
    <div className="choose-adherant">
      <ul>
        {structures.map((structure) => (
          <li key={structure.id_structur}>
            <button
              className="choose-adherant-container"
              onClick={() => {
                setNameSt(structure.nom_structure);
                setDateSt(structure.date_creation);
                loginStructure(structure.id_structur);
              }}
            >
              {structure.nom_structure}
            </button>
          </li>
        ))}

        {newStructure()}
      </ul>
    </div>
  );
};

export default ListOfStructures;