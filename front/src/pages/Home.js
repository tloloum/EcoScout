import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import { AuthAdContext } from "../contexts/AuthAd";

const Home = () => {
  const { getFirstNameAd } = useContext(AuthAdContext);

  return (
    <div>
      <Navigation />
      <main>
        <div className="home">
          <h2>Bonjour {getFirstNameAd()}!</h2>
          <div className="statistics-square">
            <Link to="/statistiques">
              <div className="square-content">
                {/*statistics data */}
                <p>Statistics</p>
              </div>
            </Link>
          </div>
          <div className="events-square">
            <Link to="/evenements">
              <div className="square-content">
                {/* events data */}
                <p>Évènements</p>
              </div>
            </Link>
          </div>
          <div className="badges-square">
            <Link to="/badges">
              <div className="square-content">
                {/* badges data */}
                <p>Badges</p>
              </div>
            </Link>
          </div>
          <div className="structures-square">
            <Link to="/structures">
              <div className="square-content">
                {/* structures data */}
                <p>Structures</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
