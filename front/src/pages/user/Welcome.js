import React from 'react';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  let navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Bienvenue sur EcoScout</h1>
      <div className="actions">
        <button onClick={() => navigate('/login')}>Se connecter</button>
        <button onClick={() => navigate('/register')}>S'enregistrer</button>
      </div>
    </div>
  );
};

export default HomePage;
