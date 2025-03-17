const express = require('express');
const router = express.Router();
const service = require('../../services/users');

// Route de déconnexion

/**
 * Route GET pour afficher la page de réinitialisation du mot de passe.
 * @function
 * @memberof module:auth
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {void} - Supprime le cookie contenant le token JWT et rend la page `reset`.
 * 
 * @description
 * Cette route permet de réinitialiser l'état de l'authentification de l'utilisateur en supprimant
 * le cookie contenant le jeton JWT. Ensuite, elle rend la vue `reset` avec un titre et un message
 * d'erreur initialisé à `null`.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (affiche la page de réinitialisation).
 */
router.get('/reset', (req, res) => {
    res.clearCookie('token'); // Supprime le cookie contenant le jeton JWT
    res.render('reset', {
        title: 'reset',
        errorMessage: null
    });// Redirige vers la page de connexion
});


/**
 * Route PUT pour mettre à jour le mot de passe de l'utilisateur.
 * @function
 * @async
 * @memberof module:auth
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Appelle le service `passwordUpdate` pour effectuer la mise à jour.
 * @throws {Error} - Retourne une erreur en cas d'échec du service ou de problème serveur.
 * 
 * @description
 * Cette route appelle le service `passwordUpdate` pour mettre à jour le mot de passe de l'utilisateur
 * en fonction des données fournies. 
 * - En cas de succès, le mot de passe est mis à jour et un message est affiché dans la console.
 * - En cas d'échec, une erreur est capturée et affichée dans la console.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (mise à jour réussie du mot de passe).
 * - 500 : Erreur serveur ou problème inattendu.
 */
router.put('/reset', async (req, res) => {
    try {
        await service.passwordUpdate(req, res);
        console.log('mise a jour du mot de passe reussi');
    } catch (error) {
        console.error('METHOD PUT passwordUpdate = erreur lors de l\'utilisation de la méthode', error);
    }
});


module.exports = router;

