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

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.post("/create-adherent", auth, userCtrl.createAdherent);
router.post("/login-adherent", auth, userCtrl.loginAdherent);
router.get("/:userId/adherents", auth, userCtrl.getAdherentsFromUser);
router.get("/:userId/adherent/:adherentId", auth_ad, userCtrl.getAdherent);
router.put("/:userId/adherent/:adherentId", auth_ad, userCtrl.updateAdherent);
router.delete("/:userId/adherent/:adherentId", auth_ad, userCtrl.deleteAdherent);

router.use((req, res, next) => {
  console.log("Requete d'authentification");
  res.send("Authentification");
});

module.exports = router;
