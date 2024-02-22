//Ce fichier contient les routes concernant l'authentification

const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");
const auth = require("../middleware/auth");

/*
1. **POST** `/users/register` - Pour créer un compte utilisateur.
2. **POST** `/users/login` - Pour se connecter à l'application.
3. **GET** `/users/{userId}` - Pour récupérer les informations d'un utilisateur.
4. **PUT** `/users/{userId}` - Pour mettre à jour les informations d'un utilisateur.
5. **DELETE** `/users/{userId}` - Pour supprimer un compte utilisateur.
*/

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.get("/:userId", auth, authCtrl.getUser);
router.put("/:userId", auth, authCtrl.updateUser);
router.delete("/:userId", auth, authCtrl.deleteUser);

router.use((req, res, next) => {
  console.log("Requete d'authentification");
  res.send("Authentification");
});

module.exports = router;
