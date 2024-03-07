// Ce fichier sert à communiquer avec la base de données de l'ademe
// URL de la documentation de l'api
// https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/api-docs.json

// const res = request(app)
//   .get(
//     "https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?select=Type_Ligne,Structure&q=voiture"
//   )
//   .expect(201);

var XMLHttpRequest = require("xhr2"); //Module pour faire des requêtes d'api

const send_request = (type, url) => {
  //type = "GET" | "POST" | "DELETE" | etc
  const xhr = new XMLHttpRequest();
  xhr.open(type, url);
  xhr.send();
  xhr.responseType = "json";
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.response);
    } else {
      console.log(`Error: ${xhr.status}, ${xhr.response}`);
    }
  };
};

const get_api_doc = () => send_request(
  "GET",
  "https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/api-docs.json"
);

const get_request = (champs, valeurs) => {
  //Attention à ne pas mettre d'espace entre les champs, ex: "champ1,champ2" OK mais "champ1, champ2" NOK
  const url = `https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?select=${champs}&q=${valeurs}`;
  send_request("GET", url);
};

// get_request("Structure,Type_Ligne", "voiture");
// get_api_doc()