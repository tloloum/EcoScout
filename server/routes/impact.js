//Ce fichier contient les routes concernant le calcul d'impact ecologique

const express = require("express");
const router = express.Router();
const impactCtrl = require('../controllers/impact')
const auth_ad = require("../middleware/auth_ad");

// Récupération de tous les impacts possible
router.get("/allname", impactCtrl.getAllImpactName);

router.get("/fillname", impactCtrl.fill_impact_name);
router.get("/getallunit/:id_impact", impactCtrl.getAllUnits);

// Récupération de l'unité d'un impact
router.get("/unit/:id_impact", impactCtrl.getImpactUnit);

// Ajout d'un impact pour un evenement donné
router.post("/add", auth_ad, impactCtrl.addImpact);

router.get("/:id_evenement", impactCtrl.getImpactByEvent);

router.get("/calcul/:id_impact_event", impactCtrl.getCalculImpact);
router.get("/calcul/:id_evenement", impactCtrl.getCalculEvent);


router.get("/fill", impactCtrl.fillImpact);

router.use((req, res, next) => {
    console.log("Aucune route impact atteinte :" + req.url);
    res.status(404).json({ message: "404: Aucune route impact atteinte" });
    //res.send("Structure"); j'ai remis en commentaire c'était une source d'erreur chez moi jsp pk
  });

module.exports = router;
