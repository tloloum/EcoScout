//Ce fichier contient les routes concernant l'authentification

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const auth_ad = require("../middleware/auth_ad");

/*
1. **POST** `/user/register` - Pour créer un compte utilisateur.
2. **POST** `/user/login` - Pour se connecter à l'application.
3. **GET** `/user/{userId}` - Pour récupérer les informations d'un utilisateur.
4. **PUT** `/user/{userId}` - Pour mettre à jour les informations d'un utilisateur.
5. **DELETE** `/user/{userId}` - Pour supprimer un compte utilisateur.
*/

//Enregistrement d'un utilisateur
//Entrée: email, password
router.post("/register", userCtrl.register);
//Connexion d'un utilisateur
//Entrée: email, password
router.post("/login", userCtrl.login);
//Création d'un adherent
//Necessite d'être connecté => token utilisateur
//Entrée: nom_ad, prenom_ad
router.post("/create-adherent", auth, userCtrl.createAdherent);
//Connexion d'un adherent
//Necessite d'être connecté => token utilisateur
//Entrée: adherent_id
router.post("/login-adherent", auth, userCtrl.loginAdherent);
//Liste des adhérents d'un utilisateur
//Necessite d'être connecté => token utilisateur
router.get("/:userId/adherents", auth, userCtrl.getAdherentsFromUser);
//Informations d'un adhérent
//Necessite d'être connecté => token adhérent
//Entrée: adherent_id
router.get("/:userId/adherent/:adherentId", auth_ad, userCtrl.getAdherent);
//Mise à jour des informations d'un adhérent
//Necessite d'être connecté => token adhérent
//Entrée: nom_ad, prenom_ad
router.put("/:userId/adherent/:adherentId", auth_ad, userCtrl.updateAdherent);
//Suppression d'un adhérent
//Necessite d'être connecté => token adhérent
router.delete(
  "/:userId/adherent/:adherentId",
  auth_ad,
  userCtrl.deleteAdherent
);

router.use((req, res, next) => {
  console.log("Requete d'authentification");
  res.send("Authentification");
});

module.exports = router;
