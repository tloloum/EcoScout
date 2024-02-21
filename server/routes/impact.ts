//Ce fichier contient le middleware pour toutes les routes 
// concernant le calcul d'impact ecologique 


import express from 'express';
const router = express.Router();


router.use((req, res, next) => {
    console.log("Requete de calcul d'impact");
    res.send('TON TAU DE CARBONE EST DE 1000 TONNES C BEAUCOUP');
});

module.exports = router;