const express = require("express");

const authRoutes = require("./routes/auth");
const actionRoutes = require("./routes/action");
const eventRoutes = require("./routes/event");
const statRoutes = require("./routes/stat");
const structRoutes = require("./routes/struct");
const objectifRoutes = require("./routes/objectifs");
const impactRouter = require("./routes/impact");

// Création d'une instance de l'application Express
const app = express();

// Le code suivant permet d'éviter l'erreur CORS en spécifiant qui a le droit d'accéfer à notre api
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // On donne l'accès à tout le monde, remplacer * par l'adresse du serv de front une fois définie
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // On donne l'autorisation d'utiliser certains headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // On donne l'autorisation d'utiliser certains méthodes
  next();
});

// Route de test
app.get("/", (req, res) => {
  // Ce code s'exécutera lorsqu'un utilisateur accédera à la page d'accueil
  console.log("Nouveau visiteur");
  // Envoi de la réponse => affichage du message "Hello World!" dans le navigateur
  res.send("Bonjour Monde!");
});

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/impact", impactRouter);
app.use("/actions", actionRoutes);
app.use("/events", eventRoutes);
app.use("/statistics", statRoutes);
app.use("/structures", structRoutes);
app.use("/objectifs", objectifRoutes);

module.exports = app;
