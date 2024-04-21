// Ce fichier contient les routes concernant les structures

const express = require("express");
const router = express.Router();
const structCtrl = require("../controllers/struct");
const auth = require("../middleware/auth");
const auth_struct = require("../middleware/auth_struct");

/*
1. **POST** `/structures` - Pour créer une nouvelle structure.
1.5 **GET** `/structures/user/{userId}` - Pour récupérer les structures possédées par un utilisateur.
2. **GET** `/structures/{structureId}` - Pour récupérer les informations d'une structure.
3. **PUT** `/structures/{structureId}` - Pour mettre à jour les informations d'une structure.
4. **DELETE** `/structures/{structureId}` - Pour supprimer une structure.
5. **POST** `/structures/{structureId}/members` - Pour ajouter un membre à la structure. 
6. **DELETE** `/structures/{structureId}/members/{memberId}` - Pour retirer un membre d'une structure.
7. **POST** `/structures/{structureId}/join` - Pour rejoindre une structure via un lien d'invitation.
8. **PUT** `/structures/{structureId}/hierarchy` - Pour faire rejoindre une structure à une autre (gestion de la hiérarchie).
*/

router.post("/create", auth, structCtrl.createStruct);
router.post("/loginstruct", auth, structCtrl.loginStruct); // renvoie le nouveau token
router.get("/user/:userId", auth, structCtrl.getStructsFromUser);

router.get("/:structureId", auth, structCtrl.getStruct);
router.put(
  "/:userId/structure/:structureId",
  auth_struct,
  structCtrl.updateStruct
);
router.delete("/:structureId", auth_struct, structCtrl.deleteStruct);
router.post("/:structureId/members", auth_struct, structCtrl.addMember);
router.delete(
  "/:structureId/members/:adherentId",
  auth_struct,
  structCtrl.removeMember
);
router.post("/:structureId/join", auth_struct, structCtrl.joinStruct);
router.put("/:structureId/hierarchy", auth_struct, structCtrl.joinHierarchy);

router.use((req, res, next) => {
  console.log("Requete de structure");
  res.send("Structure");
});

module.exports = router;
