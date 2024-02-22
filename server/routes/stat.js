// Ce fichier contient les routes concernant les statistiques

const express = require('express');
const router = express.Router();
const statCtrl = require('../controllers/stat');
const auth = require('../middleware/auth');

/*
1. **GET** `/statistics/structures/{structureId}` - Pour obtenir des statistiques globales sur l'impact écologique d'une structure.
2. **GET** `/statistics/events/{eventId}` - Pour obtenir des statistiques sur l'impact écologique d'un événement.
*/

router.get('/structures/:structureId', auth,  statCtrl.getStructureStats);
router.get('/events/:eventId', auth, statCtrl.getEventStats);

router.use((req, res, next) => {
    console.log("Requete de statistique");
    res.send('Statistique');
});

module.exports = router;