// Ce fichier contient les routes concernant les objectifs et les defis

const express = require("express");
const router = express.Router();
const objectifCtrl = require("../controllers/objectifs");
const auth = require("../middleware/auth");

/*
1. **POST** `/objectives` - Pour créer un nouvel objectif.
2. **GET** `/objectives/{objectiveId}` - Pour récupérer les informations d'un objectif.
3. **POST** `/challenges` - Pour créer un nouveau défi.
4. **GET** `/challenges/{challengeId}` - Pour récupérer les détails d'un défi.
5. **POST** `/challenges/{challengeId}/objectives` - Pour lier des objectifs à un défi.
6. **POST** `/challenges/{challengeId}/rewards` - Pour attribuer une récompense à la réalisation d'un défi.
*/

router.post("/", auth, objectifCtrl.createObjectif);
router.get("/:objectiveId", auth, objectifCtrl.getObjectif);
router.post("/challenges", auth, objectifCtrl.createChallenge);
router.get("/challenges/:challengeId", auth, objectifCtrl.getChallenge);
router.post(
  "/challenges/:challengeId/objectives",
  auth,
  objectifCtrl.linkObjectif
);
router.post("/challenges/:challengeId/rewards", auth, objectifCtrl.addReward);

router.use((req, res, next) => {
  console.log("Requete d'objectif");
  res.send("Objectif");
});

module.exports = router;
