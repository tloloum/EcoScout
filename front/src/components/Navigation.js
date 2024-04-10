import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";

const Navigation = () => {
  const { isAuthenticated, signOut } = useContext(AuthContext);

  return (
    <div className="navigation">
      <ul>
        <NavLink to="/" className={(nav) => (nav.isActive ? "nav-active" : "")}>
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
            <NavLink
              to="/profile"
              className={(nav) => (nav.isActive ? "nav-active" : "")}
            >
              <li>Profil</li>
            </NavLink>

            <li>
              <button onClick={signOut}>Déconnexion</button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
