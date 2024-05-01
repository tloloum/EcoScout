// Ce fichier contient les routes concernant les structures

const express = require("express");
const router = express.Router();
const structCtrl = require("../controllers/struct");
const auth = require("../middleware/auth");
const auth_struct = require("../middleware/auth_struct");
const auth_ad = require("../middleware/auth_ad");

// Routes pour les créations et connexions aux "comptes owners" de structures
/**
 * @api {post} /structures/create Création d'une structure
 * @apiName createStruct
 * @apiGroup Structures
 *
 * @apiParam (body) {String} nom_structure Nom de la structure
 * @apiParam (header) {String} Authorization Token d'authentification
 *
 * @apiSuccess (201) {String} message Structure créée avec succès
 * @apiError (400) {String} message Une structure avec le même nom existe déjà
 */
router.post("/create", auth, structCtrl.createStruct);
/**
 * @api {post} /structures/loginstruct Connexion à une structure
 * @apiName loginStruct
 * @apiGroup Structures
 *
 * @apiParam (body) {Number} structureId Id de la structure
 * @apiParam (header) {String} Authorization Token d'authentification user
 *
 * @apiSuccess (201) {String} userId Id de l'utilisateur
 * @apiSuccess (201) {Number} structureId Id de la structure
 * @apiSuccess (201) {String} token Token
 * @apiError (400) {String} message Champs requis manquants
 */
router.post("/loginstruct", auth, structCtrl.loginStruct);
/**
 * @api {get} /structures/user/:userId Récupérer les structures d'un utilisateur
 * @apiName getStructsFromUser
 * @apiGroup Structures
 *
 * @apiParam (params) {Number} userId Id de l'utilisateur
 * @apiParam (header) {String} Authorization Token d'authentification user
 *
 * @apiSuccess (200) {Object[]} structures Liste des structures
 *
 */
router.get("/user/:userId", auth, structCtrl.getStructsFromUser);

// Route pour les admins de structures
/**
 * @api {get} / Récuperer toutes les informations d'une structure
 * @apiName getStruct
 * @apiGroup Structures
 *
 * @apiParam (header) {String} Authorization Token d'authentification structure
 *
 * @apiSuccess (200) {Object} structure Informations de la structure
 * @apiError (500) {Object} error Erreur serveur
 */
router.get("/", auth_struct, structCtrl.getStruct);

// Route pour voir les structures existantes
/**
 * @api {get} / Récuperer toutes les structures
 * @apiName getAllStruct
 * @apiGroup Structures
 *
 * @apiParam (header) {String} Authorization Token d'authentification user ??
 *
 * @apiSuccess (200) {Object} structure Informations de la structure
 * @apiError (500) {Object} error Erreur serveur
 * @apiError (401) message Unauthorized
 */
router.get("/allstruct", auth, structCtrl.getAllStruct);

/**
 * @api {get} / Renvoyer une structure à partir de son nom
 * @apiName 
 * @apiGroup Structures
 * 
 * @apiParam (header) ??
 * @apiParam (body) {String} structName Nom de la structure recherchée
 * 
 * @apiSuccess (200) 
 * @apiError (500) {Object} error Erreur serveur
 * @apiError (401) message Unauthorized
 */

router.get("/searchstruct/:structName", auth, structCtrl.searchStruct);

/**
 * @api {put} / Mettre à jour une structure
 * @apiName updateStruct
 * @apiGroup Structures
 *
 * @apiParam (header) {String} Authorization Token d'authentification structure
 * @apiParam (body) {String} newname Nouveau nom de la structure
 *
 * @apiSuccess (200) {String} message Structure modifiée avec succès
 * @apiError (401) {String} message Non autorisé
 */

router.put("/", auth_struct, structCtrl.updateStruct);
/**
 * @api {delete} / Supprimer une structure
 * @apiName deleteStruct
 * @apiGroup Structures
 *
 * @apiParam (header) {String} Authorization Token d'authentification user
 * @apiParam (params) {Number} structureId Id de la structure
 *
 * @apiSuccess (200) {String} message Structure supprimée avec succès
 */
router.delete("/:structureId", auth, structCtrl.deleteStruct);

// Ajout/suppression d'un membre "fictif" dans une structure par le owner de la structure
/**
 * @api {post} /addmembers Ajouter un membre fictif
 * @apiName addMember
 * @apiGroup Structures
 *
 * @apiParam (body) {String} nom Nom du membre
 * @apiParam (body) {String} prenom Prénom du membre
 * @apiParam (header) {String} Authorization Token d'authentification structure
 *
 * @apiSuccess (201) {String} message Membre ajouté avec succès
 */
// TODO : Ajouter un membre fictif (faire un adherent unique ??)
router.post("/addmembers", auth_struct, structCtrl.addMember);
/**
 * @api {get} /getmembers Récupérer les membres fictifs
 * @apiName getMembers
 * @apiGroup Structures
 *
 * @apiParam (header) {String} Authorization Token d'authentification structure
 *
 * @apiSuccess (200) {Object[]} members Liste des membres fictifs
 */
router.get("/getmembers", auth_struct, structCtrl.getMembers);
/**
 * @api {delete} /delmembers/:id_p_struct Supprimer un membre fictif
 * @apiName removeMember
 * @apiGroup Structures
 *
 * @apiParam (params) {Number} id_p_struct Id du membre fictif
 * @apiParam (header) {String} Authorization Token d'authentification structure
 *
 * @apiSuccess (200) {String} message Membre supprimé avec succès
 */
router.delete("/delmembers/:id_p_struct", auth_struct, structCtrl.removeMember);

// Rejoindre une structure par un adherent
/**
 * @api {post} /:structureId/join Rejoindre une structure
 * @apiName joinStruct
 * @apiGroup Structures
 *
 * @apiParam (params) {Number} structureId Id de la structure
 * @apiParam (header) {String} Authorization Token d'authentification adherent
 *
 * @apiSuccess (201) {String} message Adhérent ajouté avec succès
 */
router.post("/:structureId/join", auth_ad, structCtrl.joinStruct);
/**
 * @api {post} /:structureId/leave Quitter une structure
 * @apiName leaveStruct
 * @apiGroup Structures
 *
 * @apiParam (params) {Number} structureId Id de la structure
 * @apiParam (header) {String} Authorization Token d'authentification adherent
 *
 * @apiSuccess (200) {String} message Adhérent supprimé avec succès
 */
// TODO : Join Hierarchy ou join structure from structure ? 
router.post("/:structureId/hierarchy", auth_struct, structCtrl.joinHierarchy);

// Récupérer les structures rejointe par un adherent
/**
 * @api {get} /adherent/:adherentId Récupérer les structures d'un adhérent
 * @apiName getStructsFromAdherent
 * @apiGroup Structures
 *
 * @apiParam (params) {Number} adherentId Id de l'adhérent
 * @apiParam (header) {String} Authorization Token d'authentification adherent
 *
 * @apiSuccess (200) {Object[]} structures Liste des structures
 */
router.get("/adherent", auth_ad, structCtrl.getStructsFromAdherent);

// Route pour récupérer les demandes de join à une structure
/**
 * @api {get} /demand/:structureId 
 * @apiName getJoinDemand
 * @apiGroup Structures, peut être à modifier
 * 
 * @apiParam (params) {Number} structureId Id de la structure
 * 
 * @apiSuccess (200) {}
 */
router.get("/demand/:structureId", auth_struct, structCtrl.getJoinDemand);


//Route pour qu'un adhérent demande à rejoindre une structure
/**
 * @api {post} /demand
 * @apiName joinDemand
 * @apiGroup Structure, peut être à modifier
 * 
 * @apiParam (params)
 */
router.post("/demand/:structureId", auth_ad, structCtrl.joinDemand);

router.use((req, res, next) => {
  console.log("Requete de structure");
  //res.send("Structure"); j'ai remis en commentaire c'était une source d'erreur chez moi jsp pk
});

module.exports = router;
