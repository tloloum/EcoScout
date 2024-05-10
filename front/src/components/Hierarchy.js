import React, { useContext, useEffect, useState } from "react";
import SearchStruct from "./SearchStruct";
import { AuthStContext } from "../contexts/AuthSt";
import { ServerContext } from "../contexts/Server";

const Hierarchy = () => {
    const { getServerAddress } = useContext(ServerContext);
    const { myTokenSt, myStructureId } = useContext(AuthStContext);
    const [showForm, setShowForm] = useState(false);
    //Fonction pour demander à join une structure en temps que structure.
    const structureSubmit = async (idStructure) => {
        const serverAddress = getServerAddress();
        const resultStructure = await fetch(
        serverAddress +
            "structures/" +
            myStructureId +
            "/hierarchy/" 
             +idStructure,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myTokenSt,
            },
        }
        );
        if (resultStructure.status !== 200) {
        console.log(
            "Erreur lors du join vers la structure parent, code d'erreur:" +
            resultStructure.status
        );
        return;
        } else {
        console.log(serverAddress + "structures");
        }
        setShowForm(false);
    };

  return <SearchStruct structureSubmit={structureSubmit} />;
};

export default Hierarchy;