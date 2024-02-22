// Ce fichier contient les routes concernant les evenements

const express = require("express");
const router = express.Router();
const eventCtrl = require("../controllers/event");
const auth = require("../middleware/auth");

/*
1. **POST** `/events` - Pour créer un nouvel événement.
2. **GET** `/events/{eventId}` - Pour récupérer les détails d'un événement.
3. **PUT** `/events/{eventId}` - Pour mettre à jour un événement.
4. **DELETE** `/events/{eventId}` - Pour supprimer un événement.
5. **POST** `/events/{eventId}/participants` - Pour ajouter des participants à l'événement.
*/

router.post("/", auth, eventCtrl.createEvent);
router.get("/:eventId",auth,  eventCtrl.getEvent);
router.put("/:eventId",auth,  eventCtrl.updateEvent);
router.delete("/:eventId",auth,  eventCtrl.deleteEvent);
router.post("/:eventId/participants",auth,  eventCtrl.addParticipant);

router.use((req, res, next) => {
  console.log("Requete d'evenement");
  res.send("Evenement");
});

module.exports = router;
