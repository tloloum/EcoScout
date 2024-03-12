import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import { ServerContext } from "../contexts/Server";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const { getServerAddress } = useContext(ServerContext);

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    login(email, password);
    const serverAddress = getServerAddress();
    console.log(serverAddress + "user/register");
    const result = await fetch(serverAddress + "user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mail: "admin9",
        password: "admin8",
      }),
    });

    console.log(result);
    console.log(result.body);
    console.log(await result.json());
    // .then((res) => {
    //   return res.json();
    // })
    // .then((res) => console.log(json.userID));
    navigate("/");
    // return result.json();
  }

  return (
    <div>
      <h1>Login</h1>

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
          <br />
          <input type="submit" value="Valider" />
        </form>
      </section>
    </div>
  );
};

export default Login;
