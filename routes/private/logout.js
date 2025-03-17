const express = require('express');
const router = express.Router();

// Route de déconnexion

/**
 * Route GET pour déconnecter l'utilisateur.
 * @function
 * @memberof module:auth
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {void} - Supprime le cookie JWT et redirige l'utilisateur vers la page de connexion.
 * 
 * @description
 * Cette route permet de déconnecter un utilisateur en supprimant le cookie contenant le jeton JWT.
 * - Une fois le cookie supprimé, l'utilisateur est redirigé vers la page de connexion.
 * - Aucune opération supplémentaire ou traitement asynchrone n'est nécessaire.
 * 
 * Exemples de statut HTTP :
 * - 302 : Succès (redirection vers la page de connexion après déconnexion).
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Supprime le cookie contenant le jeton JWT
    res.redirect('/login'); // Redirige vers la page de connexion
});

module.exports = router; 