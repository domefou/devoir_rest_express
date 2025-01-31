const express = require('express');
const router = express.Router();


const service = require('../services/users');

const private = require('../middlewares/private');

// route pour lire les infos d'un utilisateur
router.get('/users/:id',private.checkJWT, service.getById);
// route pour ajouter un utilisateur
router.put('/users/add',service.add);
// route pour modifier un utilisateur
router.patch('/users/:id',private.checkJWT, service.update);
// route pour supprimer un utilisateur
router.delete('/users/:id',private.checkJWT, service.delete);

//route authentification
router.post('/users/authenticate',service.authenticate);

module.exports = router;
