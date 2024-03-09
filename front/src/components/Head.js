import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/img/logo.jpeg";

const Header = () => {
  return (
    <header className={"header"}>
      <div className={"logo"}>
        <img src={logo} alt="Logo" />
      </div>
      <nav>
        <ul className={"navLinks"}>
          <li>
            <NavLink to="/events" className={"active"}>
              Statistiques
            </NavLink>
          </li>
          <li>
            <NavLink to="/badges" className={"active"}>
              Badges
            </NavLink>
          </li>
          <li>
            <NavLink to="/structures" className={"active"}>
              Structures
            </NavLink>
          </li>
          <li>
            <NavLink to="/events" className={"active"}>
              Évènements
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className={"searchBar"}>
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
    </header>
  );
};

export default Header;
