const connection = require("../bdd/utils/connection");
const utils = require("../bdd/utils/utils");
const jwt = require("jsonwebtoken");

const check_if_exists_struct = (nom) =>
  utils.check_if_exists("Structur", "nom_structure", nom);

// const getDateDuJour = () => {
//   const aujourdhui = new Date();
//   const annee = aujourdhui.getFullYear();
//   const mois = String(aujourdhui.getMonth() + 1).padStart(2, "0");
//   const jour = String(aujourdhui.getDate()).padStart(2, "0");
//   const date = `${annee}-${mois}-${jour}`;
//   console.log(date);
//   return date;
// };

exports.createStruct = async (req, res, next) => {
  const nom_structure = req.body.nom_structure;
  const date_creation = new Date().toISOString().slice(0, 19).replace("T", " ");
  const idUser = req.auth.userId;

  if (await check_if_exists_struct(nom_structure))
    return res
      .status(400)
      .json({ message: "A structure with the same name already exists" });
  else {
    const query = `INSERT INTO Structur (id_structur, nom_structure, date_creation, id_structur_mere, id_owner) VALUES ('0', '${nom_structure}', '${date_creation}', NULL, '${idUser}')`;
    utils.send_query_insert(query, res, 201, "Structure created successfully");
  }
};

exports.loginStruct = async (req, res, next) => {
  if (req.body.structureId == undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const structureId = req.body.structureId;
  const userId = req.auth.userId;
  const select_query = `SELECT id_owner FROM Structur WHERE id_structur = '${structureId}'`;
  const rows = await utils.send_query_select(select_query);
  if (rows.length === 0 || userId - rows[0].id_owner !== 0) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(201).json({
    userId: userId,
    structureId: structureId,
    token: jwt.sign(
      { userId: userId, structureId: structureId },
      "RANDOM_TOKEN",
      { expiresIn: "24h" }
    ),
  });
};

exports.getStructsFromUser = async (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  if (userId !== req.auth.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const select_query = `SELECT id_structur, nom_structure, date_creation, id_structur_mere FROM Structur WHERE id_owner = '${userId}'`;
  utils
    .send_query_select(select_query)
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getStruct = async (req, res, next) => {
  const id_structur = req.auth.structureId;
  const query = `SELECT * FROM Structur WHERE id_structur = '${id_structur}' `; //On renvoie l'id de la structure mere?? la structure mere en soit?
  utils
    .send_query_select(query)
    .then((rows) => {
      res.status(200).json(rows[0]);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllStruct = async (req, res, next) => {
  const query = `SELECT * FROM Structur`;
  utils
    .send_query_select(query)
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.searchStruct = async (req, res, next) => {
  const structName = req.params.structName;
  const query = `SELECT * FROM Structur WHERE nom_structure='${structName}' `;
  utils
    .send_query_select(query)
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.updateStruct = (req, res, next) => {
  const structureId = req.auth.structureId;
  const newname = req.body.newname;
  const query = `UPDATE Structur SET nom_structure = '${newname}' WHERE id_structur = '${structureId}' `;
  utils.send_query_insert(query, res, 200, "Structure updated successfully");
};

exports.deleteStruct = (req, res, next) => {
  const structureId = parseInt(req.params.structureId, 10);
  const userId = req.auth.userId;
  const query_verif = `SELECT id_owner FROM Structur WHERE id_structur = '${structureId}'`;
  connection.query(query_verif, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      if (results[0].id_owner !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        const query = `DELETE FROM Structur WHERE id_structur= '${structureId}' `;
        const query2 = `DELETE FROM Participants_Struct WHERE id_structure= '${structureId}' `;
        connection.query(query, (error, results, fields) => {
          if (error) {
            res.status(500).json({ error });
          } else {
            connection.query(query2, (error, results, fields) => {
              if (error) {
                res.status(500).json({ error });
              } else {
                res
                  .status(200)
                  .json({ message: "Structure deleted successfully" });
              }
            });
          }
        });
      }
    }
  });
};

exports.addMember = (req, res, next) => {
  const structureId = req.auth.structureId;
  const date_creation = new Date().toISOString().slice(0, 19).replace("T", " ");
  // adherentId = -1 <=> membre fictif
  const query = `INSERT INTO Participants_Struct (id_p_struct, date_join, id_structure, id_adherent) VALUES ( '0' , '${date_creation}', '${structureId}' , '-1' )`;
  utils
    .send_query_insert(
      query,
      res,
      200,
      "Member added to structure successfully"
    )
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getMembers = (req, res, next) => {
  const structureId = req.auth.structureId;
  const query = `SELECT * FROM Participants_Struct WHERE id_structure = '${structureId}'`;
  utils
    .send_query_select(query)
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.removeMember = (req, res, next) => {
  const structureId = req.auth.structureId;
  const id_p_struct = parseInt(req.params.id_p_struct, 10);
  const query = `DELETE FROM Participants_Struct WHERE id_structure=${structureId} AND id_p_struct=${id_p_struct}`;
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error });
    } else {
      res
        .status(200)
        .json({ message: "Member deleted from struct successfully" });
    }
  });
};

exports.joinStruct = (req, res, next) => {
  const adherentId = req.auth.adherentId;
  const structureId = parseInt(req.params.structureId, 10);
  const date_join = new Date().toISOString().slice(0, 19).replace("T", " ");
  const query = `INSERT INTO Participants_Struct (date_join, id_structure, id_adherent) VALUES ('${date_join}', '${structureId}', '${adherentId}')`;
  connection.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      //Il faut rajouter le delete dans demande struct ici
      res
        .status(201)
        .json({ message: "Adherent added to structure successfully" });
    }
  });
};

exports.joinHierarchy = (req, res, next) => {
  const structureId = parseInt(req.params.structureId, 10);
  const structureIdMere = req.body.structureId;
  if (structureId !== req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const query = `UPDATE Structur SET id_structur_mere=${structureIdMere} WHERE id ) ${structureId}`;
    utils
      .send_query_insert(
        query,
        res,
        200,
        "Structure joined another successfully"
      )
      .catch((error) => {
        res.status(500).json({ error });
      });
  }
};

exports.getStructsFromAdherent = (req, res, next) => {
  const adherentId = req.auth.adherentId;
  if (adherentId !== req.auth.adherentId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const select_query = `SELECT id_structure FROM Participants_Struct WHERE id_adherent = '${adherentId}'`;
  const rows = utils.send_query_select(select_query);
  let structures = [];
  for (let i = 0; i < rows.length; i++) {
    const query = `SELECT nom_structure FROM Structur WHERE id_structur = '${rows[i].id_structure}'`;
    const res = utils.send_query_select(query);
    structures.push(res);
  }
  res.status(200).json(structures);
};

exports.getJoinDemand = (req, res, next) => {
  const structId = req.params.structureId;
  console.log(req.auth.structuretId); //undefined
  if (structId !== req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const select_query = `SELECT DISTINCT Adherents.id_adherent, Adherents.nom_ad, Adherents.prenom_ad FROM Adherents JOIN Demande_join ON Adherents.id_adherent = Demande_join.id_adherent WHERE Demande_join.id_structure = '${structId}'`;
  utils
    .send_query_select(select_query)
    .then((rows) => {
      res.status(200).json(rows);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
// Je pense il faut modifier la route pour celui la afin d'avoir adherentID dans les params
exports.joinDemand = (req, res, next) => {
  const adherentId = req.params.adherentId;
  const structureId = req.params.structureId;
  console.log(adherentId); //undefined
  if (adherentId != req.auth.adherentId) {
    // non sens car on définit adherentId avec req.auth.adherentId
    return res.status(401).json({ message: "Unauthorized" });
  }
  const post_query = `INSERT INTO Demande_join (id_structure, id_adherent) VALUES ('${structureId}', '${adherentId}')`;
  utils.send_query_insert(
    post_query,
    res,
    201,
    "Demande de join envoyée avec succès"
  );
};
