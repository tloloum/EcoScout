const express = require("express");
const cors = require('cors');

const userRoutes = require("./routes/user");
const actionRoutes = require("./routes/action");
const eventRoutes = require("./routes/event");
const statRoutes = require("./routes/stat");
const structRoutes = require("./routes/struct");
const objectifRoutes = require("./routes/objectifs");
const impactRouter = require("./routes/impact");


// Création d'une instance de l'application Express
const app = express();

const corsOptions = {
  origin: "*", // Remplacez par des domaines spécifiques si nécessaire
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content', 'Accept', 'Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


// Route de test
app.get("/", (req, res) => {
  // Ce code s'exécutera lorsqu'un utilisateur accédera à la page d'accueil
  console.log("Nouveau visiteur");
  // Envoi de la réponse => affichage du message "Hello World!" dans le navigateur
  res.send("Bonjour Monde!");
});

app.use(express.json());

app.use((req, res, next) => {
  console.log("Requete :" + req.url);
  next();   
});

app.use("/user", userRoutes);
app.use("/impact", impactRouter);
app.use("/actions", actionRoutes);
app.use("/events", eventRoutes);
app.use("/statistics", statRoutes);
app.use("/structures", structRoutes);
app.use("/objectifs", objectifRoutes);

module.exports = app;
