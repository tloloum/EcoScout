import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth";
import { ServerContext } from "../../contexts/Server";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, setToken, setUserId } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);
  const [ErreurMessage, setErreurMessage] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setErreurMessage("");
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setErreurMessage("");
    setPassword(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const serverAddress = getServerAddress();
    console.log(serverAddress + "user/login");

    // Demande de token
    const resultToken = await fetch(serverAddress + "user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: email,
        password: password,
      }),
    });

    if (resultToken.status !== 200) {
      setErreurMessage("Identifiant ou mot de passe incorrect");
      return;
    } else {
      const resultTokenContent = await resultToken.json();
      // console.log(resultTokenContent);
      setUserId(resultTokenContent.userId);
      setToken(resultTokenContent.token);
      login(email, password);
      navigate("/choose");
    }
  }

  return (
    <div className="login-page">
      <section id="form">
        <h2>Se connecter</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Adresse mail : </label>
          <input
            type="text"
            id="login-email"
            placeholder="Entrez votre adresse mail"
            value={email}
            onChange={handleEmailChange}
          />
          <br />
          <label htmlFor="login-mot_de_passe">Mot de passe : </label>
          <input
            type="password"
            id="login-mot_de_passe"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={handlePasswordChange}
          />
          <br />
          <div className="error-message">{ErreurMessage}</div>
          <input type="submit" value="Valider" />
          <div className="back-to-home" onClick={() => navigate("/")}>
            Retour à l'accueil
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;
