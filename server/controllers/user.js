// Ce fichier contient les middlewares qui gèrent les requêtes vers la route /user
const bcrypt = require('bcrypt');
const connection = require('../connection')

exports.register = (req, res, next) => {
    console.log('Register request')
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            console.log('hash effectué')
            console.log(hash)
            const register_query = `INSERT INTO Utilisateurs (id_user, username, mdp) VALUES ('0', '${req.body.username}', '${hash}')`;
            connection.query(register_query, (error) => {
                if (error) {
                    console.log('query error')
                    throw error;
                } else {
                    console.log('user ok')
                    res.status(201).json({ message: 'User inserted successfully' });
                }
            });
        })
        .catch(error => {
            console.log("jsp ski spas")
            res.status(500).json({error})
        })
};

exports.login = (req, res, next) => {

};

exports.getUser = (req, res, next) => {

};

exports.updateUser = (req, res, next) => {

};

exports.deleteUser = (req, res, next) => {

};
