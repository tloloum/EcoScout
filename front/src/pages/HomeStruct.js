import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthStContext } from '../contexts/AuthSt';
import { AuthContext } from '../contexts/Auth';
import logo from '../assets/img/logo.jpeg';


//page de l'admin de la structure
const HomeStruct = () => {
    const { isAuthenticatedSt, getNameSt, signOutSt } = useContext(AuthStContext);
    const { signOut, isAuthenticated } = useContext(AuthContext);
    const nameSt=getNameSt();

    const navigate = useNavigate();

    const deco = () => {
        signOutSt();
        signOut();
        navigate('/');
    }

    const switchProfil = () => {
        signOutSt();
        if (isAuthenticated) {
          navigate('/choose');
        } else {
          navigate('/');
        }
    }
    return (
        <div className='home-st'>
            {isAuthenticatedSt}
            <div className="welcome-container">
                <h1 className="animated-title">Connecté en tant que {nameSt}</h1>
                <div className="logo-container">
                    <img src={logo} alt="Eco Scout" />
                    <h2 className="eco-scout-text">Eco Scout</h2>
                </div>
                <div className="buttons-container">
                    <button onClick={deco} className="btn-deconnexion">Déconnexion</button>
                    <button onClick={switchProfil} className="btn-changement">Choisir un autre adhérent/structure</button>
                </div>
            </div>
        </div>
    )
}

export default HomeStruct;