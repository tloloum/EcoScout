/**
 * Ce fichier contient les middlewares qui gèrent les requêtes vers la route /user
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const utils = require("../bdd/utils/utils.js");
const connection = require("../bdd/utils/connection.js");

const check_if_exists_user = (mail) =>
  utils.check_if_exists("Utilisateurs", "mail", mail);

/**
 * Middleware pour l'enregistrement d'un utilisateur.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.register = async (req, res, next) => {
  if (await check_if_exists_user(req.body.mail))
    return res.status(400).json({ message: "Mail already taken" });
  else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const register_query = `INSERT INTO Utilisateurs (id_user, mail, mdp) VALUES ('0', '${req.body.mail}', '${hash}')`;
        utils.send_query_insert(
          register_query,
          res,
          201,
          "User inserted successfully"
        );
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
  }
};

/**
 * Middleware pour la connexion d'un utilisateur.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.login = async (req, res, next) => {
  const mail = req.body.mail;
  const password = req.body.password;
  const login_query = `SELECT id_user, mdp FROM Utilisateurs WHERE mail = '${mail}'`;
  const rows = await utils.send_query_select(login_query);
  if (rows.length === 0)
    return res
      .status(401)
      .json({ message: "Identifiant ou mot de passe incorrect" });
  bcrypt
    .compare(password, rows[0].mdp)
    .then((is_valid) => {
      if (!is_valid)
        res
          .status(401)
          .json({ message: "Identifiant ou mot de passe incorrect" });
      else {
        res.status(200).json({
          userId: rows[0].id_user,
          token: jwt.sign({ userId: rows[0].id_user }, "RANDOM_TOKEN", {
            expiresIn: "24h",
          }),
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

/**
 * Middleware pour la création d'un adhérent.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */

exports.createAdherent = (req, res, next) => {
  const userId = req.auth.userId;
  const { nom_ad, prenom_ad } = req.body;
  if (!nom_ad || !prenom_ad) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const register_query = `INSERT INTO Adherents (id_adherent, nom_ad, prenom_ad, id_user) VALUES ('0', '${nom_ad}', '${prenom_ad}', '${userId}')`;
  utils.send_query_insert(
    register_query,
    res,
    201,
    "Adherent inserted successfully"
  );
};

/**
 * Middleware pour la connexion d'un adhérent.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.loginAdherent = async (req, res, next) => {
  if (req.body.adherentId === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const adherentId = req.body.adherentId;
  const userId = req.auth.userId;
  const select_query = `SELECT id_user FROM Adherents WHERE id_adherent = '${adherentId}'`;
  const rows = await utils.send_query_select(select_query);
  if (rows.length === 0 || userId - rows[0].id_user !== 0) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({
    userId: userId,
    adherentId: adherentId,
    token: jwt.sign(
      { userId: userId, adherentId: adherentId },
      "RANDOM_TOKEN",
      { expiresIn: "24h" }
    ),
  });
};

exports.getAdherentsFromUser = (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  if (userId !== req.auth.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const select_query = `SELECT id_adherent, nom_ad, prenom_ad FROM Adherents WHERE id_user = '${userId}'`;
  utils
    .send_query_select(select_query)
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

/**
 * Middleware pour obtenir les informations d'un adherent.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.getAdherent = (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  const adherentId = parseInt(req.params.adherentId, 10);
  if (userId !== req.auth.userId || adherentId !== req.auth.adherentId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const select_query = `SELECT nom_ad, prenom_ad FROM Adherents WHERE id_user = '${userId}' AND id_adherent = '${adherentId}'`;
  utils
    .send_query_select(select_query)
    .then((rows) => {
      res.status(200).json({
        nom_ad: rows[0].nom_ad,
        prenom_ad: rows[0].prenom_ad,
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

/**
 * Middleware pour mettre à jour les informations d'un utilisateur.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.updateAdherent = (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  const adherentId = parseInt(req.params.adherentId, 10);
  if (userId !== req.auth.userId || adherentId !== req.auth.adherentId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { nom_ad, prenom_ad } = req.body;
  if (!nom_ad || !prenom_ad) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const update_query = `UPDATE Adherents SET nom_ad='${nom_ad}', prenom_ad='${prenom_ad}' WHERE id_adherent='${adherentId}'`;
  utils.send_query_insert(
    update_query,
    res,
    200,
    "Adherent updated successfully"
  );
};

/**
 * Middleware pour supprimer un utilisateur.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.deleteAdherent = (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  const adherentId = parseInt(req.params.adherentId, 10);
  if (userId !== req.auth.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const query_verif = `SELECT * FROM Adherents WHERE id_user='${userId}' AND id_adherent='${adherentId}'`;
  utils
    .send_query_select(query_verif)
    .then((rows) => {
      if (rows.length === 0) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const delete_query = `DELETE FROM Adherents WHERE id_user='${userId}' AND id_adherent='${adherentId}'`;
      connection.query(delete_query, (error) => {
        if (error) {
          return res.status(500).json({ error });
        } else {
          const select_query = `SELECT * FROM Adherents WHERE id_user='${userId}' AND id_adherent='${adherentId}'`;
          utils.send_query_select(select_query)
            .then((rows) => {
              if (rows.length === 0) {
                return res.status(200).json({ message: "Adherent deleted successfully" });
              } else {
                return res.status(500).json({ error: "Failed to delete adherent" });
              }
            })
            .catch((error) => {
              return res.status(500).json({ error });
            });
        }
      }
      );
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};
// exports.deleteAdherent = (req, res, next) => {
//   const userId = parseInt(req.params.userId, 10);
//   const adherentId = parseInt(req.params.adherentId, 10);
//   if (userId !== req.auth.userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const query_verif = `SELECT * FROM Adherents WHERE id_user='${userId}' AND id_adherent='${adherentId}'`;
//   utils
//     .send_query_select(query_verif)
//     .then((rows) => {
//       if (rows.length === 0) {
//         return res.status(401).json({ message: "Unauthorized" });
//       }
//       const delete_query = `DELETE FROM Adherents WHERE id_user='${userId}' AND id_adherent='${adherentId}'`;
//       utils.send_query_insert(
//         delete_query,
//         res,
//         200,
//         "Adherent deleted successfully"
//       );
//     })
//     .catch((error) => {
//       res.status(500).json({ error });
//     });
// };
