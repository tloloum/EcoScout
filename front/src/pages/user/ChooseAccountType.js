import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ChooseAccountType = () => {
  const navigate = useNavigate();
  return (
    <div className="choose-account-type">
      <div className="account-option" onClick={() => navigate("/choose")}>
        <div className="icon">👪</div>
        <h2>Compte Parent</h2>
      </div>
      <div className="account-option" onClick={() => navigate("/registerAdherent")}>
        <div className="icon">🧍</div>
        <h2>Compte Personnel</h2>
      </div>
      <div className="account-option" onClick={() => navigate("/registerStructure")}>
        <div className="icon">👥</div>
        <h2>Compte Groupe</h2>
      </div>
      <div className="help">
        <div className="help-icon">?</div>
        <div className="help-text">
          <p>Choisissez le type de compte qui correspond le mieux à vos besoins.</p>
        </div>
      </div>
    </div>
  );
};

export default ChooseAccountType;
