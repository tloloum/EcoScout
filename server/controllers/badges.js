const connection = require("../bdd/utils/connection.js");
const utils = require("../bdd/utils/utils");

exports.getBadgesFromAd = (req, res, next) => {
  // if (!req.auth.adherentId) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  // const adherentId = req.auth.adherentId;
  // const query_verif = `SELECT * FROM Badges WHERE Badges.id_adherent= '${adherentId}'`;
  // connection.query(query, (error, rows) => {
  //   if (error) {
  //     throw error;
  //   } else {
  //     res.status(200).json(rows);
  //   }
  // });
  //TODO
};

exports.getBadgesFromStruct = (req, res, next) => {
  // if (req.body.structureId == undefined) {
  //   return res.status(400).json({ message: "Missing required fields" });
  // }
  // const structId = req.params.structureId;
  // const query_verif = `SELECT * FROM Badges WHERE Badges.id_structure= '${structId}'`;
  // connection.query(query, (error, rows) => {
  //   if (error) {
  //     throw error;
  //   } else {
  //     res.status(200).json(rows);
  //   }
  // });
  //TODO
};

exports.updateBadgesFromAd = (req, res, next) => {
  // if (!req.auth.adherentId) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }
  //TODO
};

exports.updateBadgesFromStruct = (req, res, next) => {
  // if (req.body.structureId == undefined) {
  //   return res.status(400).json({ message: "Missing required fields" });
  // }
  //TODO
};
