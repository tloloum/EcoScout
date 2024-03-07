const utils = require("../bdd/utils/utils");

const check_if_exists_struct = (nom) =>
  utils.check_if_exists("Structur", "nom_structure", nom);

exports.createStruct = async (req, res, next) => {
  const nom_structure = req.body.nom_structure;
  const date_creation = "Date du jour";
  console.log("structure creation");

  if (await check_if_exists_struct(nom_structure))
    return res
      .status(400)
      .json({ message: "A structure with the same name already exists" });
  else {
    const query = `INSERT INTO Structur (id_structur, nom_structure, date_creation, id_structur_mere) VALUES ('0', '${nom_structure}', '2022-01-10 10:17:36', NULL)`;
    utils.send_query_insert(query, res, 201, "Structure created successfully");
  }
};

exports.getStruct = (req, res, next) => {};

exports.updateStruct = (req, res, next) => {};

exports.deleteStruct = (req, res, next) => {};

exports.addMember = (req, res, next) => {};

exports.removeMember = (req, res, next) => {};

exports.joinStruct = (req, res, next) => {};

exports.joinHierarchy = (req, res, next) => {};
