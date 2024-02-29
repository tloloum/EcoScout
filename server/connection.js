const mysql = require('mysql')
const dbConfig = require('./config/db_config')
const connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWWORD,
  database: dbConfig.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// connection.connect((error) => {
//   if (error) throw error;
//   console.log('Connecté à la BDD');
// });

connection.query('select * from Utilisateurs', (err, rows, fields) => {
  if (err) throw err
  console.log(rows)
})

module.exports = connection;