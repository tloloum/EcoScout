const connection = require("./connection.js")

/**
 * Envoie une requête d'insertion à la base de données et renvoie une réponse JSON avec un message de statut.
 * @param {string} msg - La requête SQL d'insertion.
 * @param {object} res - L'objet de réponse HTTP.
 * @param {number} status_nb - Le code de statut HTTP.
 * @param {string} status_msg - Le message de statut.
 */
exports.send_query_insert = (msg, res, status_nb, status_msg) => {
  connection.query(msg, (error) => {
    if (error) {
      throw error;
    } else {
      res.status(status_nb).json({ message: status_msg });
    }
  });
};

/**
 * Envoie une requête de sélection à la base de données et renvoie les résultats sous forme de tableau.
 * @param {string} msg - La requête SQL de sélection.
 * @returns {Promise<Array>} - Les résultats de la requête sous forme de tableau.
 * @throws {Error} - Une erreur si la requête échoue.
 */
exports.send_query_select = async (msg) => {
  try {
    const rows = await new Promise((resolve, reject) => {
      connection.query(msg, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Vérifie si une valeur existe dans une table donnée.
 * @param {string} table - Le nom de la table.
 * @param {string} field - Le nom du champ.
 * @param {string} name - La valeur à vérifier.
 * @returns {Promise<number>} - Le nombre de résultats correspondants à la valeur donnée.
 */

exports.check_if_exists = async (table, field, name) => {
    const query = `SELECT COUNT(*) AS count FROM ${table} WHERE ${field}='${name}'`;
    let u = await this.send_query_select(query);
    return u[0].count;
  };
