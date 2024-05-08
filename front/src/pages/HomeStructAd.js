import React, { useContext, useParams, useState} from "react";
import { AuthAdContext } from "../contexts/AuthAd";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";

const HomeStructAd = () => {
    const structName = useParams().name;
    const { getServerAddress } = useContext(ServerContext);
    const { myTokenAd, myAdherentId } = useContext(AuthAdContext);
    const { myToken } = useContext(AuthContext);
    const { structInfo, setStructInfo } = useState([]);

    const fetchStructuresInfo = async () => {
        const serverAddress = getServerAddress();
        const response = await fetch(
            serverAddress + "/structures/searchstruct/" + structName,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + myToken,
                },
            }
        );
        if (response.ok) {
            const data = await response.json();
            setStructInfo(data);
        } else {
            console.error("Failed to fetch structures");
        }
    };

};

export default HomeStructAd;