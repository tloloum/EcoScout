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
          <div className="home-container">
            <Link to="/statistiques" className="home-container-square">
              <div className="square-content">
                {/*statistics data */}
                <p>Statistics</p>
              </div>
            </Link>
            <Link to="/evenements" className="home-container-square">
              <div className="square-content">
                {/* events data */}
                <p>Évènements</p>
              </div>
            </Link>

            <Link to="/badges" className="home-container-square">
              <div className="square-content">
                {/* badges data */}
                <p>Badges</p>
              </div>
            </Link>
            <Link to="/structures" className="home-container-square">
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
