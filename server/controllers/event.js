const connection = require("../bdd/utils/connection.js");
const utils = require("../bdd/utils/utils");

exports.createEvent = (req, res, next) => {
  if (!req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const structId = req.auth.structureId;
  const nom_evenement = req.body.nom_evenement;
  const date_debut = req.body.date_debut;
  const lieu = req.body.lieu;
  const descr = req.body.descr;
  const duree_evenement = req.body.duree_evenement;
  if (!nom_evenement || !date_debut || !lieu || !descr || !duree_evenement) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const query = `INSERT INTO Evenements (nom_evenement, lieu, duree_evenement, descr, date_debut) VALUES ('${nom_evenement}', '${lieu}', '${duree_evenement}', '${descr}', '${date_debut}')`;
  connection.query(query, (error) => {
    if (error) {
      throw error;
    } else {
      const query_id = `SELECT id_evenement FROM Evenements WHERE nom_evenement = '${nom_evenement}' AND lieu = '${lieu}' AND duree_evenement = '${duree_evenement}' AND descr = '${descr}' AND date_debut = '${date_debut}'`;
      connection.query(query_id, (error, rows) => {
        if (error) {
          throw error;
        } else {
          const id_evenement = rows[0].id_evenement;
          const query2 = `INSERT INTO Organisateurs (id_structure, id_evenement) VALUES ('${structId}', '${id_evenement}')`;
          connection.query(query2, (error) => {
            if (error) {
              const query_del = `DELETE FROM Evenements WHERE nom_evenement = '${nom_evenement}' AND lieu = '${lieu}' AND duree_evenement = '${duree_evenement}' AND descr = '${descr}' AND date_debut = '${date_debut}'`;
              connection.query(query_del, (error) => {
                if (error) {
                  throw error;
                }
              });
              throw error;
            } else {
              const query3 = `INSERT INTO Participants (id_structure, id_evenement) VALUES ('${structId}', '${id_evenement}')`;
              connection.query(query3, (error) => {
                if (error) {
                  const query_del = `DELETE FROM Evenements WHERE nom_evenement = '${nom_evenement}' AND lieu = '${lieu}' AND duree_evenement = '${duree_evenement}' AND descr = '${descr}' AND date_debut = '${date_debut}'`;
                  const query_del2 = `DELETE FROM Organisateurs WHERE id_evenement = '${id_evenement}'`;
                  connection.query(query_del, (error) => {
                    if (error) {
                      throw error;
                    }
                  });
                  connection.query(query_del2, (error) => {
                    if (error) {
                      throw error;
                    }
                  });
                  throw error;
                } else {
                  res
                    .status(201)
                    .json({ message: "Event created successfully" });
                }
              });
            }
          });
        }
      });
    }
  });
};

exports.getEventStruct = (req, res, next) => {
  if (!req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const structId = req.auth.structureId;
  const query = `SELECT * FROM Evenements WHERE id_evenement IN (SELECT id_evenement FROM Organisateurs WHERE id_structure = '${structId}')`;
  connection.query(query, (error, rows) => {
    if (error) {
      throw error;
    } else {
      res.status(200).json(rows);
    }
  });
};

exports.getEventByStructure = (req, res, next) => {
  const nom_structure = req.params.nom_structure;
  const query = `SELECT * FROM Evenements WHERE id_evenement IN (SELECT id_evenement FROM Organisateurs WHERE id_structure = (SELECT id_structure FROM Structur WHERE nom_structure = '${nom_structure}'))`;
  connection.query(query, (error, rows) => {
    if (error) {
      throw error;
    } else {
      res.status(200).json(rows);
    }
  }
  );
};

exports.getEventAd = (req, res, next) => {
  if (!req.auth.adherentId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const structId = req.params.structureId;
  const adherentId = req.auth.adherentId;
  const query_verif = `SELECT COUNT(*) AS count FROM Participants_Struct WHERE id_structure = '${structId}' AND id_adherent = '${adherentId}'`;
  connection.query(query_verif, (error, rows) => {
    if (error) {
      throw error;
    } else {
      if (rows[0].count === 0) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const query = `SELECT * FROM Evenements WHERE id_evenement IN (SELECT id_evenement FROM Organisateurs WHERE id_structure = '${structId}')`;
      connection.query(query, (error, rows) => {
        if (error) {
          throw error;
        } else {
          res.status(200).json(rows);
        }
      });
    }
  });
};

exports.joinEvent = (req, res, next) => {
  if (!req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const structureId = req.auth.structureId;
  const id_evenement = parseInt(req.params.eventId, 10);
  const query = `INSERT INTO Participants (id_structure, id_evenement) VALUES ('${structureId}', '${id_evenement}')`;
  utils.send_query_insert(
    query,
    res,
    201,
    "Structure added to event successfully"
  );
};

exports.updateEvent = (req, res, next) => {
  if (
    !req.body.nom_evenement &&
    !req.body.lieu &&
    !req.body.descr &&
    !req.body.date_debut &&
    !req.body.duree_evenement
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const structId = req.auth.structureId;
  const id_evenement = parseInt(req.params.eventId, 10);
  const query_verif = `SELECT COUNT(*) AS count FROM Organisateurs WHERE id_evenement = '${id_evenement}' AND id_structure = '${structId}'`;
  connection.query(query_verif, (error, rows) => {
    if (error) {
      throw error;
    } else {
      if (rows[0].count === 0) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      let nom_evenement, lieu, descr, date_debut, duree_evenement;
      if (req.body.nom_evenement) nom_evenement = req.body.nom_evenement;
      if (req.body.lieu) lieu = req.body.lieu;
      if (req.body.descr) descr = req.body.descr;
      if (req.body.date_debut) date_debut = req.body.date_debut;
      if (req.body.duree_evenement) duree_evenement = req.body.duree_evenement;
      let query = `UPDATE Evenements SET `;
      if (nom_evenement) query += `nom_evenement = '${nom_evenement}', `;
      if (lieu) query += `lieu = '${lieu}', `;
      if (descr) query += `descr = '${descr}', `;
      if (date_debut) query += `date_debut = '${date_debut}', `;
      if (duree_evenement) query += `duree_evenement = '${duree_evenement}', `;
      query = query.slice(0, -2);
      query += ` WHERE id_evenement = '${id_evenement}'`;
      utils.send_query_insert(query, res, 200, "Event updated successfully");
    }
  });
};

exports.deleteEvent = (req, res, next) => {
  if (!req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const structId = req.auth.structureId;
  const id_evenement = parseInt(req.params.eventId, 10);
  const query_verif = `SELECT COUNT(*) AS count FROM Organisateurs WHERE id_evenement = '${id_evenement}' AND id_structure = '${structId}'`;
  connection.query(query_verif, (error, rows) => {
    if (error) {
      throw error;
    } else {
      if (rows[0].count === 0) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const query = `DELETE FROM Evenements WHERE id_evenement = '${id_evenement}' AND id_evenement IN (SELECT id_evenement FROM Organisateurs WHERE id_structure = '${structId}')`;
      utils.send_query_insert(query, res, 200, "Event deleted successfully");
    }
  });
};
