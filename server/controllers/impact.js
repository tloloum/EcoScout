// Ce fichier sert à communiquer avec la base de données de l'ademe
// URL de la documentation de l'api
// https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/api-docs.json

let stored_results;
const utils = require("../bdd/utils/utils.js");
const fetch = require("node-fetch");
const connection = require("../bdd/utils/connection.js");

let fill_impact_name = async () => {
  let url =
    "https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?page=1&after=1&size=10000&select=Nom_base_fran%C3%A7ais&q_mode=simple";
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(url);
    const dataJson = await response.json();

    const stored_results = dataJson.results;
    console.log(stored_results.length);
    for (let i = 0; i < stored_results.length; i++) {
      const nomImpact = stored_results[i].Nom_base_français.replace(/'/g, "''");
      const insert_query = `INSERT INTO Nom_impact (nom_impact) VALUES ('${nomImpact}')`;
      connection.query(insert_query, (error) => {
        if (error) {
          throw error;
        } else {
          console.log("Inserted : " + nomImpact + " into Nom_impact");
        }
      });
    }

    if (dataJson.next) {
      url = dataJson.next;
    } else {
      hasNextPage = false;
    }
  }
};

let get_impact_name = async (contains) => {
  const query = `SELECT nom_impact FROM Nom_impact WHERE nom_impact LIKE '%${contains}%'`;
  const impacts = (await utils.send_query_select(query)).map(
    (row) => row.nom_impact
  );
  return impacts;
};

let get_impact = async (impact_name) => {
  let url =
    "https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?size=1&q=Nom_base_fran%C3%A7ais:" +
    impact_name +
    "&select=Nom_base_français,Total_poste_non_décomposé,Unité_français&q_mode=simple";
  const response = await fetch(url);
  const dataJson = await response.json();
  return dataJson.results;
};

exports.getImpact = async (req, res, next) => {
  // fill_impact_name();
  const rows = await get_impact_name("Voiture");
  const rows2 = await get_impact("Voiture E85");
  console.log(rows, rows2);
  if (
    req.body.type_moteur === undefined ||
    req.body.distance === undefined ||
    req.body.nombre_passagers === undefined ||
    req.body.vehicule === undefined
  ) {
    return res.status(400).json({ message: "Not enough data provided" });
  } else {
    const type_vehicule = req.body.type_vehicule;
    if (stored_results === undefined) {
      const data = await fetch(
        "https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?select=*&q=Voiture"
      );
      const dataJson = await data.json();
      console.log(dataJson.results);
      stored_results = dataJson.results;
    }
    // Les types de motorisation: "E85", "essence", "gazole", "GNV", "GPL", "moyenne"
    const impact = stored_results
      .filter((element) => element.Nom_base_français === req.body.vehicule)
      .filter(
        (element) =>
          element.Nom_attribut_français ===
          `Motorisation ${req.body.type_moteur}`
      );
    if (impact.length === 0) {
      return res.status(400).json({ message: "No data" });
    } else {
      const conso =
        req.body.distance *
        impact[0].Total_poste_non_décomposé *
        req.body.nombre_passagers;
      return res.status(200).json({ consommation: conso, unité: "kgCO2e" });
    }
  }
};
