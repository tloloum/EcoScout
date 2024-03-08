// Ce fichier sert à communiquer avec la base de données de l'ademe
// URL de la documentation de l'api
// https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/api-docs.json

// const res = request(app)
//   .get(
//     "https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?select=Type_Ligne,Structure&q=voiture"
//   )
//   .expect(201);

var XMLHttpRequest = require("xhr2"); //Module pour faire des requêtes d'api

const send_request = (type, url, callback) => {
  //type = "GET" | "POST" | "DELETE" | etc
  const xhr = new XMLHttpRequest();
  xhr.open(type, url);
  xhr.send();
  xhr.responseType = "json";
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(null, xhr.response);
    } else {
      callback(`Error: ${xhr.status}, ${xhr.response}`, null);
    }
  };
};

const response_to_tab = (res) => {
  const l = res.length;
  for (i = 0; i < l; i++) {
    console.log("==================");
    const obj = res[i];
    const keys = Object.keys(obj);
    for (j = 0; j < keys.length; j++) {
      console.log(`${keys[j]}: ${obj[keys[j]]}`);
    }
  }
  console.log("==================");
};

const print_response = (error, response) => {
  if (error) console.log(error);
  else {
    // response_to_tab(response);
    console.log(response)
  }
};

const get_api = (route) => {
  const url = `https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/${route}`;
  send_request("GET", url, print_response);
};

const get_api_doc = () => get_api("api-docs.json");

const get_request = (champs, valeurs) => {
  //Attention à ne pas mettre d'espace entre les champs, ex: "champ1,champ2" OK mais "champ1, champ2" NOK
  const url = `https://data.ademe.fr/data-fair/api/v1/datasets/base-carboner/lines?select=${champs}&q=${valeurs}`;
  send_request("GET", url, print_response);
};

// get_request("Nom_base_français,Type_Ligne,Type_poste,CO2f", "voiture");
// get_request("*", "Voiture")
// get_api("schema");
