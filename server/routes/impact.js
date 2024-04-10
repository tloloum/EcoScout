//Ce fichier contient les routes concernant le calcul d'impact ecologique

const express = require("express");
const router = express.Router();
const impactCtrl = require('../controllers/impact')

//Calcul d'impact d'un trajet
//Entrée: type_moteur("E85", "essence", "gazole", "GNV", "GPL", "moyenne"), distance(en km), nombre_passagers, vehicule("Voiture" uniquement pour l'instant)
//Sortie: consommation(en "kgCO2e")
router.post("/calcul", impactCtrl.getImpact); 


module.exports = router;
