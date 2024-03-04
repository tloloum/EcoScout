/**
 * Ce fichier contient les middlewares qui gèrent les requêtes vers la route /user
 */

const bcrypt = require("bcrypt");
const connection = require("../connection");
const jwt = require("jsonwebtoken");

/**
 * Envoie une requête d'insertion à la base de données et renvoie une réponse JSON avec un message de statut.
 * @param {string} msg - La requête SQL d'insertion.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {number} status_nb - Le code de statut HTTP.
 * @param {string} status_msg - Le message de statut.
 */
send_query_insert = (msg, res, status_nb, status_msg) => {
  connection.query(msg, (error) => {
    if (error) {
      throw error;
    } else {
      res.status(status_nb).json({ message: status_msg });
    }
  });
};

/**
 * Envoie une requête de sélection à la base de données et renvoie les résultats sous forme de tableau.
 * @param {string} msg - La requête SQL de sélection.
 * @returns {Promise<Array>} - Les résultats de la requête sous forme de tableau.
 * @throws {Error} - Une erreur si la requête échoue.
 */
send_query_select = async (msg) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      connection.query(msg, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Vérifie si une valeur existe dans une table donnée.
 * @param {string} table - Le nom de la table.
 * @param {string} field - Le nom du champ.
 * @param {string} name - La valeur à vérifier.
 * @returns {Promise<number>} - Le nombre de résultats correspondants à la valeur donnée.
 */
check_if_exists = async (table, field, name) => {
  const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${field}='${name}'`;
  let u = await send_query_select(query);
  return u[0].count;
};

/**
 * Middleware pour l'enregistrement d'un utilisateur.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.register = async (req, res, next) => {
  console.log("Register request");
  if (await check_if_exists("Utilisateurs", "username", req.body.username))
    return res.status(400).json({ message: "Username already taken" });
  else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const register_query = `INSERT INTO Utilisateurs (id_user, username, mdp) VALUES ('0', '${req.body.username}', '${hash}')`;
        send_query_insert(
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
  console.log("Login request");
  const username = req.body.username;
  const password = req.body.password;
  const login_query = `SELECT id_user, mdp FROM Utilisateurs WHERE username = '${username}'`;
  const rows = await send_query_select(login_query);
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
  console.log("Create adherent request");
  const userId = req.auth.userId;
  const { nom_ad, prenom_ad, mail_ad } = req.body;
  if (!nom_ad || !prenom_ad || !mail_ad) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const register_query = `INSERT INTO Adherents (id_adherent, nom_ad, prenom_ad, mail_ad, id_user) VALUES ('0', '${nom_ad}', '${prenom_ad}', '${mail_ad}', '${userId}')`;
  send_query_insert(register_query, res, 201, "Adherent inserted successfully");
};

/**
 * Middleware pour la connexion d'un adhérent.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.loginAdherent = async (req, res, next) => {
  console.log("Login adherent request");
  const adherentId = req.body.adherentId;
  const userId = req.auth.userId;
  res.status(200).json({
    adherentId: adherentId,
    token: jwt.sign(
      { userId: userId, adherentId: adherentId },
      "RANDOM_TOKEN",
      { expiresIn: "24h" }
    ),
  });
};

/**
 * Middleware pour obtenir les informations d'un utilisateur.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  const select_query = `SELECT id_adherent FROM Adherents WHERE id_user = '${userId}'`;
  // TODO
};

/**
 * Middleware pour mettre à jour les informations d'un utilisateur.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.updateUser = (req, res, next) => {
  // TODO
};

/**
 * Middleware pour supprimer un utilisateur.
 * @param {object} req - L'objet de requête HTTP.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {function} next - La fonction de middleware suivante.
 */
exports.deleteUser = (req, res, next) => {
  // TODO
};
