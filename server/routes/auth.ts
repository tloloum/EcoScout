//Ce fichier contient le middleware pour toutes les routes 
// concernant l'authentification

import express from 'express';
const router = express.Router();

router.use((req, res, next) => {
    console.log("Requete d'authentification");
    res.send('Authentification');
});

module.exports = router;