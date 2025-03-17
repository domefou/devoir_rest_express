const express = require('express');
const router = express.Router();
const secure = require('../../../middlewares/secure');


/**
 * Route GET pour afficher le menu d'administration.
 * @function
 * @memberof module:admin
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.decoded - L'utilisateur décodé après validation du token JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {void} - Rend la page `adminMenu` avec la date actuelle et les informations de l'utilisateur.
 * 
 * @description
 * Cette route rend la page `adminMenu` contenant :
 * - La date actuelle formatée au format ISO (AAAA-MM-JJ).
 * - Les informations de l'utilisateur décodé fournies par le middleware `secure.checkJWT`.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (la page `adminMenu` est affichée).
 */
router.get('/menu', secure.checkJWT, (req, res) => {

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    res.render('adminMenu', {
        formattedDate: formattedDate,
        user: req.decoded.user
    });
});




module.exports = router;