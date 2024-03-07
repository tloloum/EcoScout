// Ce fichier contient les middlewares qui gèrent les requêtes vers la route /user
const bcrypt = require("bcrypt");
const connection = require("../connection");
const jwt = require("jsonwebtoken");

send_query_insert = (msg, res, status_nb, status_msg) => {
  connection.query(msg, (error) => {
    if (error) {
      throw error;
    } else {
      res.status(status_nb).json({ message: status_msg });
    }
  });
};

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

const check_if_exists = async (table, field, name) => {
  const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${field}='${name}'`;
  let u = await send_query_select(query);
  return u[0].count;
};

const check_if_exists_user = (username) => check_if_exists("Utilisateurs", "username", username);

exports.register = async (req, res, next) => {
  console.log("Register request");
  if (await check_if_exists_user(req.body.username))
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

exports.createAdherent = (req, res, next) => {
  console.log("Create adherent request");
  const userId = req.auth.userId;
  const { nom_ad, prenom_ad, mail_ad } = req.body;
  if (!nom_ad || !prenom_ad || !mail_ad) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  console.log(nom_ad, prenom_ad, mail_ad, userId);
  const register_query = `INSERT INTO Adherents (id_adherent, nom_ad, prenom_ad, mail_ad, id_user) VALUES ('0', '${nom_ad}', '${prenom_ad}', '${mail_ad}', '${userId}')`;
  send_query_insert(register_query, res, 201, "Adherent inserted successfully");
};

exports.selectAdherent = (req, res, next) => {
  console.log("Select adherent request");
  const userId = req.auth.userId;
  const adherentId = req.body.adherentId;
  res.status(201).json({
    adherentId: rows[0].id_adherent,
    token: jwt.sign(
      { userId: userId, adherentId: rows[0].id_adherent },
      "RANDOM_TOKEN",
      { expiresIn: "24h" }
    ),
  });
};

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;
  const select_query = `SELECT id_adherent FROM Adherents WHERE id_user = '${userId}'`;
  // TODO
};

exports.updateUser = (req, res, next) => {};

exports.deleteUser = (req, res, next) => {};
