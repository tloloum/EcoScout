const utils = require("../bdd/utils/utils");

const check_if_exists_struct = (nom) =>
  utils.check_if_exists("Structur", "nom_structure", nom);

exports.createStruct = async (req, res, next) => {
  const nom_structure = req.body.nom_structure;
  const date_creation = "Date du jour";
  const idUser = parseInt(req.auth.userId, 10);
  console.log("structure creation");

  if (await check_if_exists_struct(nom_structure))
    return res
      .status(400)
      .json({ message: "A structure with the same name already exists" });
  else {
    const query = `INSERT INTO Structur (id_structur, nom_structure, date_creation, id_structur_mere, id_owner) VALUES ('0', '${nom_structure}', '2022-01-10 10:17:36', NULL, '${idUser}')`;
    utils.send_query_insert(query, res, 201, "Structure created successfully");
  }
};

exports.getStruct = async (req, res, next) => {
  const id_structur = parseInt(req.params.structureId, 10);
  const query = `SELECT nom_structur, date_creation FROM Structur WHERE id_structur = '${id_structure}' `;
  utils
    .send_query_select(query)
    .then((rows) => {
      res.status(200).json({
        nom_structur: rows[0].nom_structur,
        date_creation: rows[0].date_creation,
      });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.updateStruct = (req, res, next) => {
  const structureId = parseInt(req.params.structureId, 10);
  const NewName = req.body.newname;

  if (structureId !== req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const query = `UPDATE Structur SET nom_structure = '${newName}' WHERE id = ${structureId}`;
    utils.send_query_update(
      query,
      res,
      200,
      "Structure name updated successfully"
    );
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
    utils.send_query_insert(
      query,
      res,
      200,
      "Member added to structure successfully"
    );
  }
};

exports.removeMember = (req, res, next) => {
  const structureId = parseInt(req.params.structureId, 10);
  const adherentId = parseInt(req.params.adherentId, 10);
  if (structureId !== req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const query = `DELETE FROM Participants_Struct WHERE id_structure=${structureId} AND id_adherent=${adherentId}`;
    utils.send_query_insert(
      query,
      res,
      200,
      "Member deleted from structure successfully"
    );
  }
};

exports.joinStruct = (req, res, next) => {
  const userId = parseInt(req.params.userId, 10);
  const structureId = parseInt(req.params.structureId, 10);
  if (structureId !== req.auth.structureId) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    const query = `INSERT INTO Participants_Struct (id_p_struct, date_join, id_structur, id_adherent) VALUES ( '0' , GETDATE(), '${structureId}' , '${adherentId}' )`;
    utils.send_query_insert(
      query,
      res,
      200,
      "Member added to structure successfully"
    );
  }
};

exports.joinHierarchy = (req, res, next) => {};
