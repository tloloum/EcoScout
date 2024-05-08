import React, { useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import { AuthAdContext } from "../contexts/AuthAd";

const Navigation = () => {
  const { isAuthenticated, signOut } = useContext(AuthContext);
  const { signOutAd } = useContext(AuthAdContext);
  const navigate = useNavigate();
  const location = useLocation();

  const buttonSignOut = () => {
    signOutAd();
    signOut();
    navigate("/");
  };
  const isProfilePage = location.pathname === "/profile";

  return (
    <div className="navigation">
      <ul>
        <NavLink
          to="/homead"
          className={(nav) => (nav.isActive ? "nav-active" : "")}
        >
          <li>Accueil</li>
        </NavLink>

        {(!isAuthenticated && (
          <>
            <NavLink
              to="/login"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>Se connecter</li>
            </NavLink>

            <NavLink
              to="/login"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>S'enregistrer</li>
            </NavLink>
          </>
        )) || (
          <>
            {isAuthenticated && !isProfilePage && (
              <NavLink
                to="/profile"
                className={(nav) => (nav.isActive ? "nav-active" : "")}
              >
                <li>Profil</li>
              </NavLink>
            )}

            <li>
              <button onClick={buttonSignOut}>Déconnexion</button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
