const express = require('express');
const router = express.Router();
const Reservations = require('../../../models/reservation')
const secure = require('../../../middlewares/secure');
const service = require('../../../services/reservation');

/**
 * Route GET pour afficher les réservations et leur état actuel.
 * @function
 * @async
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.session - L'objet de la session Express pour les messages de succès et d'erreur.
 * @param {Object} req.decoded - L'utilisateur décodé après validation du token JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Rend la page `adminReservations` avec les données des réservations ou un message d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou d'utilisateur introuvable.
 * 
 * @description
 * Cette route récupère toutes les réservations et les affiche avec leurs états actuels :
 * - **En cours (onGoing)** : Si la date actuelle est comprise entre les dates de début et de fin.
 * - **À venir (futur)** : Si la date actuelle est avant la date de début.
 * - **Passé (past)** : Si la date actuelle est après la date de fin.
 * 
 * - Récupère également les réservations associées au catway `catwaysNumber = '0'`.
 * - Trie les réservations par date de début avant de les afficher.
 * - Si aucun utilisateur décodé n'est trouvé ou si une erreur survient, renvoie une réponse d'erreur.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (réservations rendues).
 * - 400 : Erreur (utilisateur décodé introuvable).
 * - 501 : Erreur serveur lors de la recherche des réservations.
 */
router.get('/reservations', secure.checkJWT, async (req, res, next) => {
    try {
        // Vérifiez si l'utilisateur est correctement décodé
        if (!req.decoded || !req.decoded.user) {
            console.error('Utilisateur décodé introuvable');
            return res.status(400).send('Utilisateur décodé introuvable');
        }

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const successMessage = req.session.successMessage;
        req.session.successMessage = null;

        const errorMessage = req.session.errorMessage;
        req.session.errorMessage = null;

        // Recherche de toutes les réservations
        const reservations = await Reservations.find({});
        if (!reservations || reservations.length === 0) {
            req.session.errorMessage = 'Aucune réservation trouvée.';
            return res.render('adminReservations', {
                catwaysWaiting: null,
                reservations: null,
                findReservations: null,
                formattedDate: formattedDate,
                user: req.decoded.user,
                errorMessage: errorMessage,
                successMessage: successMessage
            });
        }

        // Recherche des réservations avec catwaysNumber = '0'
        const catwaysWaiting = await Reservations.find({ catwaysNumber: '0' });

        // Ajout de l'état des réservations
        const now = new Date();
        reservations.forEach(reservation => {
            const startDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);

            if (now >= startDate && now <= endDate) {
                reservation.status = 'onGoing'; // En cours
            } else if (startDate > now) {
                reservation.status = 'futur'; // À venir
            } else {
                reservation.status = 'past'; // Passé
            }

            // Formater les dates
            reservation.startDate = startDate.toISOString().split('T')[0];
            reservation.endDate = endDate.toISOString().split('T')[0];
        });

        // Trie les réservations par date de début
        reservations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

        // Rendu de la vue
        res.render('adminReservations', {
            catwaysWaiting: catwaysWaiting || null,
            reservations: reservations,
            findReservations: null, // Peut être utilisé plus tard pour des recherches spécifiques
            formattedDate: formattedDate,
            user: req.decoded.user,
            errorMessage: errorMessage,
            successMessage: successMessage
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error);
        return res.status(501).json({ message: "Erreur serveur lors de la recherche.", error });
    }
});



/**
 * Route GET pour afficher les réservations associées à un numéro de catway spécifique.
 * @function
 * @async
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.params - Les paramètres de l'URL.
 * @param {string} req.params.catwaysNumber - Le numéro du catway à rechercher.
 * @param {Object} req.session - L'objet de la session Express contenant les messages de succès et d'erreur.
 * @param {Object} req.decoded - L'utilisateur décodé après validation du token JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Rend la page `adminReservations` avec les informations des réservations ou renvoie une erreur JSON.
 * @throws {Error} - Retourne une erreur en cas de problème de validation ou de problème serveur.
 * 
 * @description
 * Cette route récupère les informations des réservations en fonction du numéro de catway fourni dans l'URL.
 * - **Validation** : Vérifie que le `catwaysNumber` fourni est un nombre valide.
 * - **Gestion des réservations** :
 *   - Ajoute un statut aux réservations : `onGoing` (en cours), `futur` (à venir), ou `past` (passé).
 *   - Formate les dates de début et de fin des réservations au format ISO (AAAA-MM-JJ).
 * - Filtre les réservations par numéro de catway (`catwaysNumber`) pour afficher les résultats correspondants.
 * - Recherche des réservations sans catway attribué (`catwaysNumber = '0'`).
 * - Rend la page `adminReservations` avec les informations des réservations, ainsi que les messages de session et l'utilisateur authentifié.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (réservations rendues).
 * - 400 : Erreur de validation (le numéro de catway n'est pas un nombre valide).
 * - 500 : Erreur serveur ou problème inattendu.
 */
router.get('/reservations/:catwaysNumber', secure.checkJWT, async (req, res, next) => {
    try {
        const catwaysNumber = req.params.catwaysNumber;
        if (isNaN(Number(catwaysNumber))) {
            return res.status(400).json({ message: 'Le numéro de catways doit être un nombre.' });
        }

        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        const successMessage = req.session.successMessage;
        req.session.successMessage = null;

        const errorMessage = req.session.errorMessage;
        req.session.errorMessage = null;

        // Recherche des réservations
        const reservations = await Reservations.find({});
        if (!reservations || reservations.length === 0) {
            req.session.errorMessage = 'Aucune réservation trouvée.';
            return res.render('adminReservations', {
                catwaysWaiting: null,
                reservations: null,
                findReservations: null,
                formattedDate: formattedDate,
                user: req.decoded.user,
                errorMessage: errorMessage,
                successMessage: successMessage
            });
        }

        // Ajout du statut et formatage des dates pour chaque réservation
        reservations.forEach(reservation => {
            const now = new Date();
            const startDate = new Date(reservation.startDate);
            const endDate = new Date(reservation.endDate);

            if (now >= startDate && now <= endDate) {
                reservation.status = 'onGoing'; // En cours
            } else if (startDate > now) {
                reservation.status = 'futur'; // À venir
            } else {
                reservation.status = 'past'; // Passé
            }

            reservation.startDate = startDate.toISOString().split('T')[0];
            reservation.endDate = endDate.toISOString().split('T')[0];
        });

        // Filtrer les réservations par numéro de catway
        const findReservations = await Reservations.find({ catwaysNumber: catwaysNumber });
        const catwaysWaiting = await Reservations.find({ catwaysNumber: '0' });
        if (catwaysNumber === 0) {
            return res.render('adminReservations', {
                catwaysWaiting: catwaysWaiting || null,
                reservations: reservations,
                findReservations: null,
                formattedDate: formattedDate,
                user: req.decoded.user,
                errorMessage: errorMessage,
                successMessage: successMessage
            })
        } else {
            return res.render('adminReservations', {
                catwaysWaiting: catwaysWaiting || null,
                reservations: reservations,
                findReservations: findReservations || null,
                formattedDate: formattedDate,
                user: req.decoded.user,
                errorMessage: errorMessage,
                successMessage: successMessage
            });
        }
        // Rendu de la vue

    } catch (error) {
        console.error('Erreur lors de la recherche des réservations :', error);
        return res.status(500).json({ message: "Erreur serveur lors de la recherche.", error });
    }
});



/**
 * Route POST pour rechercher une réservation spécifique.
 * @function
 * @async
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Exécute le service `getById` pour effectuer la recherche.
 * @throws {Error} - Retourne une erreur si le serveur ou le service échoue.
 * 
 * @description
 * Cette route appelle le service `getById` pour rechercher une réservation en fonction des données fournies dans la requête.
 * - Protégée par un middleware JWT pour authentifier et autoriser l'utilisateur.
 * - Si une erreur se produit, une réponse JSON avec un statut 501 est retournée.
 */
router.post('/reservations/find', secure.checkJWT, async (req, res, next) => {
    try {
        await service.getById(req, res);
    } catch (error) {
        return res.status(501).json({ message: "POST/FIND serveur introuvable", error });
    }
});



/**
 * Route DELETE pour supprimer une réservation spécifique.
 * @function
 * @async
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Exécute le service `delete` pour supprimer la réservation.
 * @throws {Error} - Retourne une erreur si le serveur ou le service échoue.
 * 
 * @description
 * Cette route appelle le service `delete` pour supprimer une réservation spécifique.
 * - Protégée par un middleware JWT pour authentifier et autoriser l'utilisateur.
 * - Si une erreur survient et que les en-têtes HTTP ne sont pas encore envoyés, une réponse JSON avec un statut 501 est retournée.
 */
router.delete('/reservations/delete', secure.checkJWT, async (req, res, next) => {
    try {
        await service.delete(req, res);
    } catch (error) {
        if (!res.headersSent) {
            return res.status(501).json({ message: "Route DELETE serveur introuvable", error });
        }
    }
});

/**
 * Route PUT pour mettre à jour une réservation.
 * @function
 * @async
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Exécute le service `update` pour modifier les informations d'une réservation.
 * @throws {Error} - Retourne une erreur si le serveur ou le service échoue.
 * 
 * @description
 * Cette route utilise le service `update` pour mettre à jour une réservation avec les données fournies.
 * - Protégée par un middleware JWT pour authentifier et autoriser l'utilisateur.
 * - Si une erreur se produit et que les en-têtes HTTP ne sont pas encore envoyés, une réponse JSON avec un statut 501 est retournée.
 */
router.put('/reservations/put', secure.checkJWT, async (req, res) => {
    try {
        await service.update(req, res);
    } catch (error) {
        if (!res.headersSent) {
            return res.status(501).json({ message: "Route PUT serveur introuvable", error });
        }
    }

});


/**
 * Route POST pour ajouter une nouvelle réservation.
 * @function
 * @async
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Exécute le service `add` pour créer une nouvelle réservation.
 * @throws {Error} - Retourne une erreur si le serveur ou le service échoue.
 * 
 * @description
 * Cette route appelle le service `add` pour ajouter une nouvelle réservation dans la base de données.
 * - Protégée par un middleware JWT pour authentifier et autoriser l'utilisateur.
 * - Si une erreur survient et que les en-têtes HTTP ne sont pas encore envoyés, une réponse JSON avec un statut 501 est retournée.
 */
router.post('/reservations/add', secure.checkJWT, async (req, res, next) => {
    try {
        await service.add(req, res);
    } catch (error) {
        if (!res.headersSent) {
            return res.status(501).json({ message: "Route POST serveur introuvable", error });
        }
    }

});





module.exports = router;