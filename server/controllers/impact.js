// Ce fichier sert à communiquer avec la base de données de l'ademe
// URL de la documentation de l'api
// https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/api-docs.json

let stored_results;
const utils = require("../bdd/utils/utils.js");
const fetch = require("node-fetch");
const connection = require("../bdd/utils/connection.js");

exports.fill_impact_name = async (req,res,next) => {
  let url =
      "https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?page=1&after=1&size=1000&sort=&select=Nom_base_fran%C3%A7ais,Unit%C3%A9_fran%C3%A7ais,Total_poste_non_d%C3%A9compos%C3%A9&q_mode=simple";
  let hasNextPage = true;

  while (hasNextPage) {
      const response = await fetch(url);
      const dataJson = await response.json();

      const storedResults = dataJson.results;
      for (let i = 0; i < storedResults.length; i++) {
          const nomImpact = storedResults[i].Nom_base_français.replace(/'/g, "''");

          // Prepare unit value
          let unite = "NULL";
          if (storedResults[i].Unité_français) {
              unite = storedResults[i].Unité_français.replace(/'/g, "''");
          }

          // Total poste value
          const totalPosteNonDecompose = storedResults[i].Total_poste_non_décomposé;

          // Parameterized query to insert the values safely
          const insertQuery = `INSERT INTO Nom_impact (nom_impact, unite, total_poste_non_decompose) VALUES (?, ?, ?)`;
          const queryValues = [nomImpact, unite, totalPosteNonDecompose];

          // Execute the query
          connection.query(insertQuery, queryValues, (error) => {
              if (error) {
                  throw error;
              }
          });
      }

      // Determine if there is a next page
      if (dataJson.next) {
          url = dataJson.next;
      } else {
          hasNextPage = false;
      }
  }

  return res.status(200).json({ message: "Impact name filled" });
};

exports.fillImpact = async (req, res, next) => {
  await fill_impact_name();
  return res.status(200).json({ message: "Impact name filled" });
}

exports.getAllUnits = async (req, res, next) => {
  const id_impact = req.params.id_impact;
  const name_query = `SELECT Nom_impact FROM Nom_impact WHERE id_impact = ${id_impact}`;
  const rows = await utils.send_query_select(name_query);
  const nom_impact = rows[0].Nom_impact;
  const query = `SELECT unite, id_impact FROM Nom_impact WHERE nom_impact = '${nom_impact}'`;
  const rows2 = await utils.send_query_select(query);
  return res.status(200).json(rows2);
}

exports.getAllImpactName = async (req, res, next) => {
  const query = "SELECT * FROM Nom_impact";
  const rows = await utils.send_query_select(query);
  return res.status(200).json(rows);
};

let cutUniteAfterSlash = (unite) => {
  if (unite.includes("/")) {
    return unite.split("/")[1];
  } else {
    return unite;
  }
}

exports.getImpactUnit = async (req, res, next) => {
  const id_impact = req.params.id_impact;
  const query = `SELECT nom_impact, unite FROM Nom_impact WHERE id_impact = ${id_impact}`;
  const rows = await utils.send_query_select(query);
  const unite = cutUniteAfterSlash(rows[0].unite);
  return res.status(200).json({ unite: unite, nom_impact: rows[0].nom_impact });
}

exports.addImpact = async (req, res, next) => { 
  const id_adherent = req.auth.adherentId;
  const query = `INSERT INTO Impact (id_evenement, id_impact, valeur, nombre_personnes, id_adherent) VALUES (${req.body.id_evenement}, ${req.body.id_impact}, ${req.body.valeur}, ${req.body.nombre_personnes}, ${id_adherent})`;
  connection.query(query, (error) => {
      if (error) {
          throw error;
      } else {
          return res.status(200).json({ message: "Impact added" });
      }
  }
  );
};

exports.getImpactByEvent = async (req, res, next) => {
  const id_evenement = req.params.id_evenement;
  const query = `SELECT *, (SELECT nom_impact FROM Nom_impact WHERE id_impact = Impact.id_impact) as nom_impact FROM Impact WHERE id_evenement = ${id_evenement}`;
  const rows = await utils.send_query_select(query);
  return res.status(200).json(rows);
}

let calculImpact = async (id_impact_event) => {
  const query = `SELECT id_impact, valeur FROM Impact WHERE id_impact_event = ${id_impact_event}`;
  const rows = await utils.send_query_select(query);
  const getTotalPoste = `SELECT total_poste_non_decompose FROM Nom_impact WHERE id_impact = ${rows[0].id_impact}`;
  const rows2 = await utils.send_query_select(getTotalPoste);
  return rows[0].valeur * rows2[0].total_poste_non_decompose;
};

exports.getCalculImpact = async (req, res, next) => {
  const id_impact_event = req.params.id_impact_event;
  const impact = await calculImpact(id_impact_event);
  return res.status(200).json({ impact: impact });
};  

exports.getCalculEvent = async (req, res, next) => {
  const id_evenement = req.params.id_evenement;
  const query = `SELECT id_impact, nombre_personnes, valeur FROM Impact WHERE id_evenement = ${id_evenement}`;
  const rows = await utils.send_query_select(query);
  let total = 0;
  for (let i = 0; i < rows.length; i++) {
    const getTotalPoste = `SELECT total_poste_non_decompose FROM Nom_impact WHERE id_impact = ${rows[i].id_impact}`;
    const rows2 = await utils.send_query_select(getTotalPoste);
    total += rows[i].valeur * rows2[0].total_poste_non_decompose / rows[i].nombre_personnes;
  }
  return res.status(200).json({ impact: total });
};

exports.getTotalAdherent = async (req, res, next) => {
  const id_adherent = req.auth.adherentId;
  const query = `SELECT id_impact_event FROM Impact WHERE id_adherent = ${id_adherent}`;
  const rows = await utils.send_query_select(query);
  let total = 0;
  for (let i = 0; i < rows.length; i++) {
    total += await calculImpact(rows[i].id_impact_event);
  }
  return res.status(200).json({ impact: total });
}