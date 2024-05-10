//Ce fichier contient les routes concernant les badges

const express = require("express");
const router = express.Router();
const badgesCtrl = require("../controllers/badges");
const auth_ad = require("../middleware/auth_ad");
const auth_struct = require("../middleware/auth_struct");

// Récupération de tous les badges possible pour un adhérent
router.get("/badges/adherent/:adherentId", auth_ad, badgesCtrl.getBadgesFromAd);

// Récupération de tous les badges possible pour une structure
router.get("/badges/:structureId", auth_struct, badgesCtrl.getBadgesFromStruct);

// Validation d'un badge pour un adhérent
router.put(
  "/update/adherent/:id_badges",
  auth_ad,
  badgesCtrl.updateBadgesFromAd
);

// Validation d'un badge pour une structure
router.put(
  "/update/struct/:id_badges",
  auth_struct,
  badgesCtrl.updateBadgesFromStruct
);

module.exports = router;
