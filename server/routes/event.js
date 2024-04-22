
// Ce fichier contient les routes concernant les evenements
const express = require("express");
const router = express.Router();
const eventCtrl = require("../controllers/event");
const auth_struct = require("../middleware/auth_struct");
const auth_ad = require("../middleware/auth_ad");

/**
 * @api {post} /events/create Création d'un événement
 * @apiName createEvent
 * @apiGroup Events
 * 
 * @apiParam (body) {String} nom_evenement Nom de l'événement
 * @apiParam (body) {String} date_debut Date de début de l'événement
 * @apiParam (body) {String} lieu Lieu de l'événement
 * @apiParam (body) {String} descr Description de l'événement
 * @apiParam (body) {String} duree_evenement Durée de l'événement
 * @apiParam (header) {String} Authorization Token d'authentification structure
 * 
 * @apiSuccess (201) {String} message Evénement créé avec succès
 * @apiError (400) {String} message Champs requis manquants
 * @apiError (500) {Object} error Erreur serveur
 */
router.post("/create", auth_struct, eventCtrl.createEvent);
/**
 * @api {get} /events/struct/allevents Récupérer tous les événements d'une structure (depuis le token d'authentification structure)
 * @apiName getEventStruct
 * @apiGroup Events
 * 
 * @apiParam (header) {String} Authorization Token d'authentification structure
 * 
 * @apiSuccess (200) {Object[]} events Liste des événements
 * @apiError (500) {Object} error Erreur serveur
 */
router.get("/struct/allevents", auth_struct, eventCtrl.getEventStruct);
/**
 * @api {get} /events/ad/:structureId Récupérer tous les événements d'une structure (depuis le token d'authentification adhérent appartenant à la structure)
 * @apiName getEventAd
 * @apiGroup Events
 * 
 * @apiParam (params) {Number} structureId Id de la structure
 * @apiParam (header) {String} Authorization Token d'authentification adhérent
 * 
 * @apiSuccess (200) {Object[]} events Liste des événements
 * @apiError (401) {String} message Unauthorized (token ou adherant n'appartient pas a la structure demandée)
 * @apiError (500) {Object} error Erreur serveur
 */
router.get("/ad/:structureId", auth_ad, eventCtrl.getEventAd);

/**
 * @api {post} /events/join/:eventId Rejoindre un événement (depuis le token d'authentification adhérent)
 * @apiName joinEvent
 * @apiGroup Events
 * 
 * @apiParam (params) {Number} eventId Id de l'événement
 * @apiParam (header) {String} Authorization Token d'authentification adhérent
 * 
 * @apiSuccess (201) {String} message Adhérent inscrit à l'événement
 * @apiError (401) {String} message Unauthorized (token ou adherant n'appartient pas a la structure demandée)
 */
router.post("/join/:eventId", auth_struct, eventCtrl.joinEvent);

/**
 * @api {put} /events/update/:eventId Modifier un événement (depuis le token d'authentification structure)
 * @apiName updateEvent
 * @apiGroup Events
 * 
 * @apiParam (params) {Number} eventId Id de l'événement
 * @apiParam (body) {String} nom_evenement Nouveau nom de l'événement (optionnel)
 * @apiParam (body) {String} date_debut Nouvelle date de début de l'événement (optionnel)
 * @apiParam (body) {String} lieu Nouveau lieu de l'événement (optionnel)
 * @apiParam (body) {String} descr Nouvelle description de l'événement (optionnel)
 * @apiParam (body) {String} duree_evenement Nouvelle durée de l'événement (optionnel)
 * @apiParam (header) {String} Authorization Token d'authentification structure
 * 
 */
router.put("/update/:eventId", auth_struct, eventCtrl.updateEvent);

/**
 * @api {delete} /events/delete/:eventId Supprimer un événement (depuis le token d'authentification structure)
 * @apiName deleteEvent
 * @apiGroup Events
 * 
 * @apiParam (params) {Number} eventId Id de l'événement
 * @apiParam (header) {String} Authorization Token d'authentification structure
 * 
 * @apiSuccess (200) {String} message Evénement supprimé avec succès
 * @apiError (401) {String} message Unauthorized (token ou adherant n'appartient pas a la structure demandée)
 */
router.delete("/delete/:eventId", auth_struct, eventCtrl.deleteEvent);

router.use((req, res, next) => {
  console.log("Requete d'evenement");
  res.send("Evenement");
});

module.exports = router;
