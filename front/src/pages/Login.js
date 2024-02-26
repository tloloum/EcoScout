import React from "react";

const Login = () => {
  return (
    <div>
      <h1>Login</h1>

      <section id="form">
        <h2>Se connecter</h2>
        <form action="">
          <label for="login-email">Adresse mail : </label>
          <input
            type="text"
            id="login-email"
            placeholder="Entrez votre adresse mail"
          />
          <br />
          <label for="login-mot_de_passe">Mot de passe : </label>
          <input
            type="text"
            id="login-mot_de_passe"
            placeholder="Entrez votre mot de passe"
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
