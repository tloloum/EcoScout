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
  const idUser = parseInt(req.auth.userId, 10); //j'ai le droit de faire ça??
  console.log("structure creation");
  console.log(date_creation);

  if (await check_if_exists_struct(nom_structure))
    return res
      .status(400)
      .json({ message: "A structure with the same name already exists" });
  else {
    const query = `INSERT INTO Structur (id_structur, nom_structure, date_creation, id_structur_mere, id_owner) VALUES ('0', '${nom_structure}', '${date_creation}', NULL, '${idUser}')`;
    utils.send_query_insert(query, res, 201, "Structure created successfully");
  }
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

exports.getStruct = async (req, res, next) => {
  const id_structur = parseInt(req.params.structureId, 10);
  const query = `SELECT nom_structure, date_creation, id_structur_mere FROM Structur WHERE id_structur = '${id_structur}' `; //On renvoie l'id de la structure mere?? la structure mere en soit?
  utils
    .send_query_select(query)
    .then((rows) => {
      res.status(200).json({
        nom_structure: rows[0].nom_structure,
        date_creation: rows[0].date_creation,
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.updateStruct = (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  const structureId = parseInt(req.params.structureId, 10);
  const NewName = req.body.newname;
  if (structureId !== req.auth.structureId && userId !== req.auth.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const query = `UPDATE Structur SET nom_structure = '${NewName}' WHERE id_structur = ${structureId}`; //on modifie ici que le nom, mais est-ce que c'est le seul truc à modifier?
    utils.send_query_insert(query, res, 200, "Structure updated successfully");
  }
};

exports.deleteStruct = (req, res, next) => {
  const structureId = parseInt(req.params.structureId, 10);
  if (structureId !== req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const query = `DELETE FROM Structur WHERE id_structur= '${structureId}' `;
    utils.send_query_insert(query, res, 200, "Structure deleted successfully");
  }
};

exports.addMember = (req, res, next) => {
  const structureId = parseInt(req.params.structureId, 10);
  const adherentId = parseInt(req.body.adherentId, 10);
  if (structureId !== req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const query = `INSERT INTO Participants_Struct (id_p_struct, date_join, id_structur, id_adherent) VALUES ( '0' , GETDATE(), '${structureId}' , '${adherentId}' )`;
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
  }
};

exports.removeMember = (req, res, next) => {
  const structureId = parseInt(req.params.structureId, 10);
  const adherentId = parseInt(req.params.adherentId, 10);
  if (structureId !== req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const query = `DELETE FROM Participants_Struct WHERE id_structure=${structureId} AND id_adherent=${adherentId}`;
    utils
      .send_query_insert(
        query,
        res,
        200,
        "Member deleted from structure successfully"
      )
      .catch((error) => {
        res.status(500).json({ error });
      });
  }
};

exports.joinStruct = (req, res, next) => {
  const userId = parseInt(req.params.userId, 10); //vraiment utile ici??
  const structureId = parseInt(req.params.structureId, 10);
  if (structureId !== req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const query = `INSERT INTO Participants_Struct (id_p_struct, date_join, id_structur, id_adherent) VALUES ( '0' , GETDATE(), '${structureId}' , '${adherentId}' )`;
    utils
      .send_query_insert(
        query,
        res,
        200,
        "Member added to structure from link successfully"
      )
      .catch((error) => {
        res.status(500).json({ error });
      });
  }
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
