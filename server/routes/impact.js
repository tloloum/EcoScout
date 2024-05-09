//Ce fichier contient les routes concernant le calcul d'impact ecologique

const express = require("express");
const router = express.Router();
const impactCtrl = require('../controllers/impact')
const auth_ad = require("../middleware/auth_ad");

// Récupération de tous les impacts possible
router.get("/allname", impactCtrl.getAllImpactName);

// Récupération de l'unité d'un impact
router.get("/unit/:id_impact", impactCtrl.getImpactUnit);

// Ajout d'un impact pour un evenement donné
router.post("/add", auth_ad, impactCtrl.addImpact);

router.get("/:id_evenement", impactCtrl.getImpactByEvent);

router.get("/calcul/:id_impact_event", impactCtrl.getCalculImpact);
router.get("/calcul/:id_evenement", impactCtrl.getCalculEvent);


router.get("/fill", impactCtrl.fillImpact);

module.exports = router;
