//Ce fichier contient les routes concernant les actions ecologiques

const express = require('express');
const router = express.Router();
const actionCtrl = require('../controllers/action');
const auth = require('../middleware/auth');

/*
1. **POST** `/actions` - Pour enregistrer une nouvelle action ayant un impact écologique.
2. **GET** `/actions/{actionId}` - Pour récupérer les détails d'une action écologique.
3. **DELETE** `/actions/{actionId}` - Pour supprimer une action écologique.
*/

router.post('/', auth, actionCtrl.createAction);
router.get('/:actionId', auth,  actionCtrl.getAction);
router.delete('/:actionId',auth,  actionCtrl.deleteAction);

router.use((req, res, next) => {
    console.log("Requete d'action");
    res.send('Action');
});

module.exports = router;