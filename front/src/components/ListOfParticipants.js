import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../contexts/Auth";
// import { AuthAdContext } from "../contexts/AuthAd";
import { AuthStContext } from "../contexts/AuthSt";
import { ServerContext } from "../contexts/Server";


const ListOfParticipants = (props) => {
    // const { myToken, myUserId } = useContext(AuthContext);
    const { getServerAddress } = useContext(ServerContext);
    const {myStructureId , myTokenSt, myNameSt} = useContext(AuthStContext);

    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [admins, setAdmins] = useState(null);
    // const [showMinus, setShowMinus] = useState(false);

    useEffect(() => {
        const serverAddress = getServerAddress();

        // Fetch participants associated with the current struct
        async function showParticipants() {
            console.log(myStructureId + " " + myTokenSt);
            if (!myTokenSt || !myStructureId) return;

            const resultParticipant = await fetch(
                serverAddress + "structures/getmembers/" + myStructureId,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + myTokenSt,
                    },
                }
            );

            if (resultParticipant.status !== 200) {
                console.log("Erreur lors de la récupération des participants");
                return;
            } else {
                const resultParticipantContent = await resultParticipant.json();
                console.log(resultParticipantContent.results);
                console.log("Participants récupérés avec succès "+ resultParticipantContent); //ici la longueur = undefined je recoi uniquement le message de succes
                // if (resultParticipantContent.length > 0) {
                    // console.log(resultParticipantContent+ "adza"); // je rentre jamais la donc pas de participant 
                setParticipants(resultParticipantContent.results);
                // }
            }
        }
        showParticipants();
    }, [getServerAddress, myTokenSt, myStructureId]);

    useEffect(() => {
        const serverAddress = getServerAddress();
        const fetchAdmins = async () => {
            // Récupérer les administrateurs depuis votre API
            const response = await fetch(serverAddress + "structures/getadmins/" + myStructureId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + myTokenSt,
                },
            });
            if (response.ok) {
                console.log(admins+"fajkeea");
                const data = await response.json();
                setAdmins(data); // Mettre à jour la liste des administrateurs
                console.log(data);
            }
        };
        fetchAdmins();
    }, [getServerAddress, myTokenSt, myStructureId]);

    const handleAddAdminButton = async (participantId) => {
        const serverAddress = getServerAddress();
        const response = await fetch(serverAddress + "structures/admin/" + myStructureId + "/adherent/" + participantId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + myTokenSt,
            },
        });
        // console.log(participantId);
        // console.log(response.status);
        if (response.status !== 201) {
            console.log("Erreur lors de l'ajout de l'admin");
            return;
        }
        console.log("Admin ajouté avec succès");
        navigate("/HomeStruct/"+myNameSt);
    }

    const handleRemoveParticipantButton = async (participantId) => {
        const serverAddress = getServerAddress();
        if(window.confirm("Voulez-vous vraiment supprimer ce participant ?")){

        const response = await fetch(serverAddress + "structures/delmember/" + myStructureId + "/adherent/" + participantId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + myTokenSt,
            },
        });
        console.log(response.status);
        if (response.status !== 200) {
            console.log("Erreur lors de la suppression du participant");
            return;
        }
    }
        navigate("/HomeStruct/"+myNameSt);
    }
    return(
        <div className="list-ad-struct-container">
            <div className="list-of-participants">
            <h2>Liste des participants</h2>
            <ul>
                {participants.map((participant) => (
                    <li key={participant.id_adherent}>
                        {participant.nom_ad} {participant.prenom_ad}
                        {(admins !== null) && (admins.results.some(admin => admin.id === participant.id_adherent)) &&(
                        <button onClick={() => handleAddAdminButton(participant.id_adherent)}>Ajouter en tant qu'admin</button>)}
                        <button onClick={() => handleRemoveParticipantButton(participant.id_adherent)}>Supprimer</button>
                    </li>
                ))}
            </ul>
                </div>
        </div>
    )
};
export default ListOfParticipants;