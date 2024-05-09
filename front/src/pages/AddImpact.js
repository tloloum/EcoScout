import React, { useContext } from "react";
import { AuthAdContext } from "../contexts/AuthAd";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AddImpact = () => {
    return (
        <div className="add-impact">
            <Sidebar />
            <div className="content">
                <h1>Ajouter un impact</h1>
                <p>Page en construction</p>
            </div>
        </div>
    );
};

export default AddImpact;