import express from 'express';

// Création d'une instance de l'application Express
const app = express();

// Le code suivant permet d'éviter l'erreur CORS en spécifiant qui a le droit d'accéfer à notre api
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // On donne l'accès à tout le monde, remplacer * par l'adresse du serv de front une fois définie
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // On donne l'autorisation d'utiliser certains headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // On donne l'autorisation d'utiliser certains méthodes
  next();
});









// Route de test
app.get("/", (req, res) => {
  // Ce code s'exécutera lorsqu'un utilisateur accédera à la page d'accueil
  console.log("Nouveau visiteur") 
  // Envoi de la réponse => affichage du message "Hello World!" dans le navigateur
  res.send("Bonjour Monde!");
});

//On définit des routeurs qui vont gérer les requêtes vers les différentes routes
//par exemple, pour les requêtes vers /auth, on utilisera le routeur authentificationRouter
//et toutes les url du type notreUrl/auth/quelquechose seront gérées par ce routeur
//cela permet de faire du code plus factorisé et plus lisible

const authentificationRouter = require('./routes/auth');
const impactRouter = require('./routes/impact');

app.use('/auth', authentificationRouter);
app.use('/impact', impactRouter);


module.exports = app;