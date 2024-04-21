import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAdContext } from '../contexts/AuthAd';
import { AuthContext } from '../contexts/Auth';
import Sidebar from '../components/Sidebar';
import logo from '../assets/img/logo.jpeg';

const HomeAd = () => {
  const { isAuthenticatedAd, getFirstNameAd, signOutAd } = useContext(AuthAdContext);
  const { signOut, isAuthenticated } = useContext(AuthContext);
  const prenom = getFirstNameAd();

  const navigate = useNavigate();

  const deco = () => {
    signOutAd();
    signOut();
    navigate('/');
  };

  const switchProfil = () => {
    signOutAd();
    if (isAuthenticated) {
      navigate('/choose');
    } else {
      navigate('/');
    }
  }

  return (
    <div className="home-ad">
      {isAuthenticatedAd && <Sidebar />}
      <div className="welcome-container">
        <h1 className="animated-title">Bienvenue {prenom}</h1>
        <div className="logo-container">
          <img src={logo} alt="Eco Scout" />
          <h2 className="eco-scout-text">Eco Scout</h2>
        </div>
        <div className="buttons-container">
          <button onClick={deco} className="btn-deconnexion">Déconnexion</button>
          <button onClick={switchProfil} className="btn-changement">Changement de profil</button>
        </div>
      </div>
    </div>
  );
}

export default HomeAd;
