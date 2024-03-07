//Ce fichier contient les routes concernant le calcul d'impact ecologique

const express = require("express");
const router = express.Router();
const impactCtrl = require('../controllers/impact')

router.use((req, res, next) => {
  console.log("Requete de calcul d'impact");
  res.send("TON TAU DE CARBONE EST DE 1000 TONNES C BEAUCOUP");
});

module.exports = router;
