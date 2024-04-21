// Ce fichier sert à communiquer avec la base de données de l'ademe
// URL de la documentation de l'api
// https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/api-docs.json

let stored_results;
const utils = require("../bdd/utils/utils.js");
const fetch = require("node-fetch");
const connection = require("../bdd/utils/connection.js");

let fill_impact_name = async () => {
  let url =
    "https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?page=1&after=1&size=1000&sort=&select=Nom_base_fran%C3%A7ais,Unit%C3%A9_fran%C3%A7ais,Total_poste_non_d%C3%A9compos%C3%A9&q_mode=simple";
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(url);
    const dataJson = await response.json();

    const stored_results = dataJson.results;
    for (let i = 0; i < stored_results.length; i++) {
      const nomImpact = stored_results[i].Nom_base_français.replace(/'/g, "''");
      let unite = "NULL"
      if (stored_results[i].Unité_français)
        unite = stored_results[i].Unité_français.replace(/'/g, "''");
      const insert_query = `INSERT INTO Nom_impact (nom_impact, unite, total_poste_non_decompose) VALUES ('${nomImpact}', '${unite}', ${stored_results[i].Total_poste_non_décomposé})`;
      connection.query(insert_query, (error) => {
        if (error) {
          throw error;
        } else {
          console.log("Inserted : " + nomImpact + " " + stored_results[i].Unité_français + " " + stored_results[i].Total_poste_non_décomposé);
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

exports.getAllImpactName = async (req, res, next) => {
  // await fill_impact_name();
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
  const query = `SELECT unite FROM Nom_impact WHERE id_impact = ${id_impact}`;
  const rows = await utils.send_query_select(query);
  const unite = cutUniteAfterSlash(rows[0].unite);
  return res.status(200).json({ unite: unite });
}

exports.addImpact = async (req, res, next) => {
  const id_adherent = req.auth.adherentId;
  const query = `INSERT INTO Impact (id_evenement, id_impact, valeur, nombre_personnes, id_adherent) VALUES (${req.body.id_evenement}, ${req.body.id_impact}, ${req.body.valeur}, ${req.body.nombre_personnes}, ${id_adherent})`;
  const rows = await utils.send_query_insert(query);
  return res.status(200).json({ message: "Impact added" });
};

exports.getImpactByEvent = async (req, res, next) => {
  const id_evenement = req.params.id_evenement;
  const query = `SELECT * FROM Impact WHERE id_evenement = ${id_evenement}`;
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
  const query = `SELECT id_impact_event FROM Impact WHERE id_evenement = ${id_evenement}`;
  const rows = await utils.send_query_select(query);
  let total = 0;
  for (let i = 0; i < rows.length; i++) {
    total += await calculImpact(rows[i].id_impact_event);
  }
  return res.status(200).json({ impact: total });
};

exports.getImpact = async (req, res, next) => {
  // fill_impact_name();
  const rows = await get_impact_name("Voiture");
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
