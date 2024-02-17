import express, { Request, Response } from "express";

// Création d'une instance de l'application Express
const app = express();

// Route de test
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Port sur lequel le serveur écoutera les requêtes
const port = 3000;

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur Express démarré sur le port ${port}`);
});
