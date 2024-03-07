import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Utilisation de useNavigate pour effectuer des redirections

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(email, password);
    // Redirection vers la page d'accueil après la connexion réussie
    navigate("/");
  };

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
            type="password" // Change type to "password" for security
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

// import React, { useContext, useState } from "react";

// import { AuthContext } from "../contexts/Auth";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // Accéder à la fonction login depuis le contexte d'authentification
//   const { login } = useContext(AuthContext);
//   const history = useHis(); // Initialiser useHistory

//   const handleEmailChange = (event) => {
//     setEmail(event.target.value);
//   };

//   const handlePasswordChange = (event) => {
//     setPassword(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Utiliser la fonction login du contexte d'authentification
//     login(email, password);
//     history.push("/");
//   };

//   return (
//     <div>
//       <h1>Login</h1>

//       <section id="form">
//         <h2>Se connecter</h2>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="login-email">Adresse mail : </label>
//           <input
//             type="text"
//             id="login-email"
//             placeholder="Entrez votre adresse mail"
//             value={email}
//             onChange={handleEmailChange}
//           />
//           <br />
//           <label htmlFor="login-mot_de_passe">Mot de passe : </label>
//           <input
//             type="password" // Change type to "password" for security
//             id="login-mot_de_passe"
//             placeholder="Entrez votre mot de passe"
//             value={password}
//             onChange={handlePasswordChange}
//           />
//           <br />
//           <br />
//           <input type="submit" value="Valider" />
//         </form>
//       </section>
//     </div>
//   );
// };

// export default Login;

// import React from "react";

// const Login = () => {
//   return (
//     <div>
//       <h1>Login</h1>

//       <section id="form">
//         <h2>Se connecter</h2>
//         <form action="">
//           <label for="login-email">Adresse mail : </label>
//           <input
//             type="text"
//             id="login-email"
//             placeholder="Entrez votre adresse mail"
//           />
//           <br />
//           <label for="login-mot_de_passe">Mot de passe : </label>
//           <input
//             type="text"
//             id="login-mot_de_passe"
//             placeholder="Entrez votre mot de passe"
//           />
//           <br />
//           <br />
//           <input type="submit" value="Valider" />
//         </form>
//       </section>
//     </div>
//   );
// };

// export default Login;
