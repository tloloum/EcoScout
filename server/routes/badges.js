//Ce fichier contient les routes concernant les badges

const express = require("express");
const router = express.Router();
const badgesCtrl = require("../controllers/badges");
const auth_ad = require("../middleware/auth_ad");
const auth_struct = require("../middleware/auth_struct");

// // génère les badges pour une structure
// router.post("/create/:structureId", auth_struct, badgesCtrl.createBadges);

// // génère les badges pour un adhérent
// router.post("/create/adherent/:adherentId", auth_ad, badgesCtrl.createBadges);

// Récupération de tous les badges possible pour un adhérent
router.get("/adherent/:adherentId", auth_ad, badgesCtrl.getBadgesFromAd);

// Récupération de tous les badges possible pour une structure
router.get("/:structureId", auth_struct, badgesCtrl.getBadgesFromStruct);

// Validation d'un badge pour un adhérent
router.put(
  "/update/:id_badges/adherent/:adherentId",
  auth_ad,
  badgesCtrl.updateBadgesFromAd
);

// Validation d'un badge pour une structure
router.put(
  "/update/:id_badges/struct/:structureId",
  auth_struct,
  badgesCtrl.updateBadgesFromStruct
);

module.exports = router;
