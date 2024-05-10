//Ce fichier contient les routes concernant l'authentification

const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const auth_ad = require("../middleware/auth_ad");

/**
 * @api {post} /user/register Enregistrement d'un utilisateur
 * @apiName register
 * @apiGroup User
 *
 * @apiParam (body) {String} email Email de l'utilisateur
 * @apiParam (body) {String} password Mot de passe de l'utilisateur
 *
 * @apiSuccess (201) {String} message Utilisateur enregistré avec succès
 * @apiError (400) {String} message Mail déjà pris
 * @apiError (500) {Object} error Erreur serveur
 */
router.post("/register", userCtrl.register);
/**
 * @api {post} /user/login Connexion d'un utilisateur
 * @apiName login
 * @apiGroup User
 *
 * @apiParam (body) {String} email Email de l'utilisateur
 * @apiParam (body) {String} password Mot de passe de l'utilisateur
 *
 * @apiSuccess (200) {String} token Token user
 * @apiError (401) {String} message Identifiant ou mot de passe incorrect
 * @apiError (500) {Object} error Erreur serveur
 */
router.post("/login", userCtrl.login);
/**
 * @api {post} /user/create-adherent Création d'un adhérent
 * @apiName createAdherent
 * @apiGroup User
 *
 * @apiParam (header) {String} Authorization Token d'authentification utilisateur
 * @apiParam (body) {String} nom_ad Nom de l'adhérent
 * @apiParam (body) {String} prenom_ad Prénom de l'adhérent
 *
 * @apiSuccess (201) {String} message Adhérent créé avec succès
 * @apiError (400) {String} message Champs manquants
 * @apiError (500) {Object} error Erreur serveur
 */
router.post("/create-adherent", auth, userCtrl.createAdherent);
/**
 * @api {post} /user/login-adherent Connexion d'un adhérent
 * @apiName loginAdherent
 * @apiGroup User
 *
 * @apiParam (body) {Number} adherentId Id de l'adhérent
 *
 * @apiSuccess (200) {String} token Token adhérent
 * @apiError (401) {String} message Identifiant ou mot de passe incorrect
 * @apiError (500) {Object} error Erreur serveur
 */
router.post("/login-adherent", auth, userCtrl.loginAdherent);
/**
 * @api {get} /user/infos Récupérer tous les adhérents d'un utilisateur
 * @apiName getUserInfos
 * @apiGroup User
 *
 * @apiParam (header) {String} Authorization Token d'authentification utilisateur
 * @apiParem (params) {Number} userId Id de l'utilisateur
 *
 * @apiSuccess (200) {Object} user Informations de l'utilisateur
 * @apiError (401) {String} message Unauthorized
 * @apiError (500) {Object} error Erreur serveur
 */
router.get("/:userId/adherents", auth, userCtrl.getAdherentsFromUser);
/**
 * @api {get} /user/infos Récupérer les informations d'un adhérent
 * @apiName getAdherent
 * @apiGroup User
 *
 * @apiParam (header) {String} Authorization Token d'authentification adhérent
 * @apiParam (params) {Number} userId Id de l'utilisateur
 * @apiParam (params) {Number} adherentId Id de l'adhérent
 *
 * @apiSuccess (200) {Object} adherent Informations de l'adhérent
 * @apiError (401) {String} message Unauthorized
 * @apiError (500) {Object} error Erreur serveur
 */
router.get("/:userId/adherent/:adherentId", auth_ad, userCtrl.getAdherent);
/**
 * @api {put} /user/infos Mettre à jour un adhérent
 * @apiName updateAdherent
 * @apiGroup User
 *
 * @apiParam (header) {String} Authorization Token d'authentification adhérent
 * @apiParam (params) {Number} userId Id de l'utilisateur
 * @apiParam (params) {Number} adherentId Id de l'adhérent
 * @apiParam (body) {String} nom_ad Nom de l'adhérent
 * @apiParam (body) {String} prenom_ad Prénom de l'adhérent
 *
 * @apiSuccess (200) {String} message Adhérent mis à jour avec succès
 * @apiError (400) {String} message Champs manquants
 * @apiError (401) {String} message Unauthorized
 * @apiError (500) {Object} error Erreur serveur
 */
router.put("/:userId/adherent/:adherentId", auth_ad, userCtrl.updateAdherent);
/**
 * @api {delete} /user/infos Supprimer un adhérent
 * @apiName deleteAdherent
 * @apiGroup User
 *
 * @apiParam (header) {String} Authorization Token d'authentification user
 * @apiParam (params) {Number} userId Id de l'utilisateur
 * @apiParam (params) {Number} adherentId Id de l'adhérent
 *
 * @apiSuccess (200) {String} message Adhérent supprimé avec succès
 * @apiError (401) {String} message Unauthorized
 * @apiError (500) {Object} error Erreur serveur
 *
 * @apiSuccess (200) {String} message Adhérent supprimé avec succès
 * @apiError (401) {String} message Unauthorized
 * @apiError (500) {Object} error Erreur serveur
 */
router.delete("/:userId/adherent/:adherentId", auth, userCtrl.deleteAdherent);

router.use((req, res, next) => {
  console.log("Requete d'authentification");
  console.log("méthode : " + req.method);
  res.send("Authentification");
});

module.exports = router;
