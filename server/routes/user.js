//Ce fichier contient les routes concernant l'authentification

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

/*
1. **POST** `/user/register` - Pour créer un compte utilisateur.
2. **POST** `/user/login` - Pour se connecter à l'application.
3. **GET** `/user/{userId}` - Pour récupérer les informations d'un utilisateur.
4. **PUT** `/user/{userId}` - Pour mettre à jour les informations d'un utilisateur.
5. **DELETE** `/user/{userId}` - Pour supprimer un compte utilisateur.
*/

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/:userId", auth, userCtrl.getUser);
router.put("/:userId", auth, userCtrl.updateUser);
router.delete("/:userId", auth, userCtrl.deleteUser);

router.use((req, res, next) => {
  console.log("Requete d'authentification");
  res.send("Authentification");
});

module.exports = router;
