import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";
import { ServerContext } from "../contexts/Server";
import { useNavigate } from "react-router-dom";
import SearchStruct from "../components/SearchStruct";


const JoinStructAd = () => {
    const { getServerAddress } = useContext(ServerContext);
    const { myToken, myUserId } = useContext(AuthContext);
    const { myAdherentId, myTokenAd } = useContext(AuthAdContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [structures, setStructures] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [idStructure, setIdStructure] = useState("");
    //Fonction pour demander à join une structure en temps qu'adhérent.
    const structureSubmit = async (idStructure) => {
        const serverAddress = getServerAddress();
        console.log(
        serverAddress +
            "structures/demand/" +
            idStructure +
            "/adherent/" +
            myAdherentId
        );
        const resultStructure = await fetch(
        serverAddress +
            "structures/demand/" +
            idStructure +
            "/adherent/" +
            myAdherentId,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + myTokenAd,
            },
        }
        );
        if (resultStructure.status !== 201) {
        console.log(
            "Erreur lors de la demande de join, code d'erreur:" +
            resultStructure.status
        );
        return;
        } else {
        console.log(serverAddress + "structures");
        const resultStructureContent = await resultStructure.json();
        console.log(resultStructureContent);
        }
        setShowForm(false);
    };
    return (
    <div>
        <SearchStruct structureSubmit={structureSubmit}/>
        
    </div>
    
    )
}

export default JoinStructAd;