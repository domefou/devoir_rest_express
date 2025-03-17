const express = require('express');
const router = express.Router();
const secure = require('../../../middlewares/secure');
const Reservations = require('../../../models/reservation')
const service = require('../../../services/userResevation');
const Users = require('../../../models/users');


/**
 * Route GET pour afficher les réservations d'un utilisateur spécifique.
 * @function
 * @async
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.decoded - L'utilisateur décodé après validation du token JWT.
 * @param {string} req.decoded.user.name - Le nom de l'utilisateur connecté.
 * @param {Object} req.session - L'objet de session contenant les messages de succès et d'erreur.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Rend la page `reservation` avec les informations des réservations ou un message d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur.
 * 
 * @description
 * Cette route récupère toutes les réservations associées au nom de l'utilisateur connecté (`clientName`).
 * - Trie les réservations par date de début, de la plus proche à la plus éloignée.
 * - Formate les dates au format ISO (AAAA-MM-JJ) pour un affichage uniforme.
 * - Si des réservations existent, elles sont rendues sur la page `reservation`.
 * - Si aucune réservation n'est trouvée, la page `reservation` est rendue sans contenu.
 * - Les messages de succès et d'erreur sont récupérés de la session et réinitialisés après usage.
 * - La date actuelle est incluse dans la vue pour un affichage contextualisé.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (les réservations ou une page vide sont affichées).
 * - 501 : Erreur serveur ou problème inattendu.
 */
router.get('/reservation', secure.checkJWT, async (req, res) => {
    const { user } = req.decoded; // Correction de la récupération de l'utilisateur
    const userName = user.name;

    try {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const successMessage = req.session.successMessage;
        req.session.successMessage = null;

        const errorMessage = req.session.errorMessage;
        req.session.errorMessage = null;

        // Recherche des réservations pour l'utilisateur
        const reservations = await Reservations.find({ clientName: userName });

        if (reservations && reservations.length > 0) {
            // Trie les réservations par date de début
            reservations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

            // Formate les dates au format ISO
            reservations.forEach(reservation => {
                reservation.startDate = new Date(reservation.startDate).toISOString().split('T')[0];
                reservation.endDate = new Date(reservation.endDate).toISOString().split('T')[0];
            });

            // Rendu de la vue avec les réservations
            res.render('reservation', {
                reservations: reservations,
                formattedDate: formattedDate,
                user: req.decoded.user,
                successMessage: successMessage,
                errorMessage: errorMessage
            });
        } else {
            // Rendu sans réservation
            res.render('reservation', {
                reservations: null,
                formattedDate: formattedDate,
                user: req.decoded.user,
                successMessage: successMessage,
                errorMessage: errorMessage
            });
        }
    } catch (error) {
        console.error("Erreur dans /reservation :", error);
        return res.status(501).json({ message: "GET serveur introuvable", error });
    }
});



/**
 * Route GET pour afficher les réservations d'un utilisateur spécifique par son adresse email.
 * @function
 * @async
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.params - Les paramètres de l'URL.
 * @param {string} req.params.email - L'adresse email de l'utilisateur dont les réservations doivent être récupérées.
 * @param {Object} req.session - L'objet session pour les messages de succès et d'erreur.
 * @param {Object} req.decoded - L'utilisateur décodé après validation du token JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Rend la page `reservation` avec les réservations de l'utilisateur ou un message d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou d'utilisateur introuvable.
 * 
 * @description
 * Cette route récupère les réservations associées à un utilisateur spécifique par son email :
 * - **Recherche de l'utilisateur** : Trouve l'utilisateur correspondant à l'email dans la base de données.
 * - **Validation utilisateur** : Si l'utilisateur n'existe pas, redirige vers `/admin/user` avec un message d'erreur.
 * - **Récupération des réservations** : Récupère les réservations liées à `clientName` (nom de l'utilisateur).
 * - **Tri et formatage des réservations** :
 *   - Trie les réservations par date de début (ordre croissant).
 *   - Formate les dates de début et de fin au format ISO (AAAA-MM-JJ).
 * - Rend la vue `reservation` avec les données récupérées ou une vue vide si aucune réservation n'est trouvée.
 * - Les messages de succès et d'erreur sont récupérés de la session et réinitialisés après usage.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (réservations rendues ou vue vide).
 * - 501 : Erreur serveur ou problème inattendu.
 */
router.get('/reservation/:email', secure.checkJWT, async (req, res) => {
    const { email } = req.params;
    try {

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const successMessage = req.session.successMessage;
        req.session.successMessage = null;

        const errorMessage = req.session.errorMessage;
        req.session.errorMessage = null;

        const user = await Users.findOne({ email: email });

        if (!user) {
            req.session.errorMessage = `Utilisateur introuvable.`;
            return res.redirect('/admin/user'); // Redirige vers une autre page si l'utilisateur est introuvable
        }

        const userName = user.name;
        const reservations = await Reservations.find({ clientName: userName });

        if (reservations && reservations.length > 0) {
            // Trie les réservations par date de début
            reservations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

            // Formate les dates pour chaque réservation
            reservations.forEach(reservation => {
                reservation.startDate = new Date(reservation.startDate).toISOString().split('T')[0];
                reservation.endDate = new Date(reservation.endDate).toISOString().split('T')[0];
            });

            res.render('reservation', {
                reservations: reservations,
                formattedDate: formattedDate,
                user: req.decoded.user,
                successMessage: successMessage,
                errorMessage: errorMessage
            });
        } else {
            // Rendu sans réservations
            res.render('reservation', {
                reservations: null,
                formattedDate, formattedDate,
                user: req.decoded.user,
                successMessage: successMessage,
                errorMessage: errorMessage
            });
        }
    } catch (error) {
        console.error("Erreur dans /reservation/:email :", error);
        return res.status(501).json({ message: "GET serveur introuvable", error });
    }
});


/**
 * Route POST pour ajouter une nouvelle réservation.
 * @function
 * @async
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête pour créer la réservation.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Exécute le service `add` pour créer une nouvelle réservation.
 * @throws {Error} - Retourne une erreur si le service ou le serveur échoue.
 * 
 * @description
 * Cette route utilise le service `add` pour ajouter une nouvelle réservation à la base de données.
 * - Protégée par le middleware `secure.checkJWT` pour authentifier et autoriser l'utilisateur.
 * - En cas de succès, la logique de traitement et de réponse est gérée par le service appelé.
 * - Si une erreur survient et que les en-têtes HTTP n'ont pas encore été envoyés, une réponse JSON avec un statut HTTP 501 est retournée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (nouvelle réservation ajoutée).
 * - 501 : Erreur serveur ou problème inattendu.
 */
router.post('/reservation/add', secure.checkJWT, async (req, res, next) => {
    try {
        await service.add(req, res);
    } catch (error) {
        if (!res.headersSent) {
            return res.status(501).json({ message: "Route POST serveur introuvable", error });
        }
    }

});



module.exports = router;