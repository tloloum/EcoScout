const connection = require("../bdd/utils/connection.js");
const utils = require("../bdd/utils/utils");

// exports.createBadges = (req, res, next) => {
//   const structId = req.params.structureId;
//   if (req.auth.structureId != structId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   const query = `SELECT * FROM Adherents WHERE Adherents.id_structure= '${structId}'`;
//   connection.query(query, (error, rows) => {
//     if (error) {
//       throw error;
//     } else {
//       rows.forEach((row) => {
//         const query_badge = `INSERT INTO Badges (id_adherent, id_structure, statut) VALUES ('${row.id_adherent}', '${structId}', FALSE)`;
//         connection.query(query_badge, (error) => {
//           if (error) {
//             throw error;
//           }
//         });
//       });
//       res.status(200).json({ message: "Badges created" });
//     }
//   });
// };

exports.getBadgesFromAd = (req, res, next) => {
  const adherendId = parseInt(req.params.adherentId, 10);
  if (req.auth.adherentId != adherendId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const query = `SELECT * FROM Badges WHERE Badges.id_adherent= '${adherendId}'`;
  connection.query(query, (error, rows) => {
    if (error) {
      throw error;
    } else {
      res.status(200).json(rows);
    }
  });
};

exports.getBadgesFromStruct = (req, res, next) => {
  const structId = req.params.structureId;
  if (req.auth.structureId != structId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // if (req.body.structureId == undefined) {
  //   return res.status(400).json({ message: "Missing required fields" });
  // }
  const query_verif = `SELECT * FROM Badges WHERE Badges.id_structure= '${structId}'`;
  connection.query(query, (error, rows) => {
    if (error) {
      throw error;
    } else {
      res.status(200).json(rows);
    }
  });
};

exports.updateBadgesFromAd = (req, res, next) => {
  const adherendId = parseInt(req.params.adherentId, 10);
  if (req.auth.adherentId != adherendId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const badgeId = parseInt(req.params.id_badges, 10);
  const query = `UPDATE Badges SET statut = TRUE WHERE Badges.id_badges = '${badgeId}' AND Badges.id_adherent = '${adherendId}'`;
  connection.query(query, (error, rows) => {
    if (error) {
      throw error;
    } else {
      res.status(200).json({ message: "Badge updated" });
    }
  });
};

exports.updateBadgesFromStruct = (req, res, next) => {
  const structId = parseInt(req.params.structureId,10);
  if (req.auth.structureId != structId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const badgeId = parseInt(req.params.id_badges, 10);
  const query = `UPDATE Badges SET statut = TRUE WHERE Badges.id_badges = '${badgeId}' AND Badges.id_structure = '${structId}'`;
  connection.query(query, (error, rows) => {
    if (error) {
      throw error;
    } else {
      res.status(200).json({ message: "Badge updated" });
    }
  });
  //TODO
};
