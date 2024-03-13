// Ce fichier sert à communiquer avec la base de données de l'ademe
// URL de la documentation de l'api
// https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/api-docs.json

let stored_results;

exports.getImpact = async (req, res, next) => {
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
      return res
        .status(200)
        .json({consommation: conso, unité: "kgCO2e" });
    }
  }
};
