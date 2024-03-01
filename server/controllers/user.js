// Ce fichier contient les middlewares qui gèrent les requêtes vers la route /user
const bcrypt = require("bcrypt");
const connection = require("../connection");
const jwt = require("jsonwebtoken");


exports.register = (req, res, next) => {
  console.log("Register request");
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const register_query = `INSERT INTO Utilisateurs (id_user, username, mdp) VALUES ('0', '${req.body.username}', '${hash}')`;
      connection.query(register_query, (error) => {
        if (error) {
          throw error;
        } else {
          res.status(201).json({ message: "User inserted successfully" });
        }
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.login = (req, res, next) => {
  console.log("Login request");
  const username = req.body.username;
  const login_query = `SELECT id_user, mdp FROM Utilisateurs WHERE username = '${username}'`;
  connection.query(login_query, (error, rows) => {
    if (error) throw error;
    else {
      bcrypt
        .compare(req.body.password, rows[0].mdp)
        .then((is_valid) => {
            if (!is_valid) res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
            else {
                res.status(200).json({
                  userId: rows[0].id_user,
                  token: jwt.sign(
                    { userId: rows[0].id_user },
                    'RANDOM_TOKEN',
                    { expiresIn: '24h' }
                  )
                })
            }
        })
        .catch((error) => {
            res.status(500).json({error});
        })
    }
  });
};

exports.getUser = (req, res, next) => {};

exports.updateUser = (req, res, next) => {};

exports.deleteUser = (req, res, next) => {};
