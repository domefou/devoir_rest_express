const Reservations = require('../models/reservation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

// authenticate est une fonction qui va permettre de vérifier si un utilisateur existe et si le mot de passe est correct

/**
 * Récupère une réservation pour un catway spécifique par son numéro.
 * @async
 * @function getById
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.params - Les paramètres de l'URL.
 * @param {string} req.params.catwaysNumber - Le numéro du catway à rechercher (optionnel).
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body.catwaysNumber - Le numéro du catway à rechercher (optionnel).
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Redirige vers la page de réservation avec un message de succès ou d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur.
 * 
 * @description
 * Cette méthode recherche une réservation pour un catway spécifique dans la base de données en fonction du numéro de catway (`catwaysNumber`).
 * - Si aucune réservation n'est trouvée, un message d'erreur est renvoyé et l'utilisateur est redirigé.
 * - Si une réservation est trouvée, un message de succès est renvoyé et l'utilisateur est redirigé.
 * - En cas d'erreur serveur, une réponse JSON appropriée est renvoyée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (redirige l'utilisateur vers la page de réservation).
 * - 500 : Erreur serveur lors de la recherche.
 */
exports.getById = async (req, res, next) => {
    const catwaysNumber = req.params.catwaysNumber || req.body.catwaysNumber;
    try {
        //const catways = await Catways.find({});
        const findReservations = await Reservations.findOne({ catwaysNumber: catwaysNumber });
        if (!findReservations) {
            req.session.errorMessage = `Aucune reservation pour le catway n° : ${catwaysNumber}.`;
            return res.redirect(`/admin/reservations/${catwaysNumber}`);

        }
        if (findReservations) {
            req.session.successMessage = `Catway n° : ${catwaysNumber} trouvé`;
            return res.redirect(`/admin/reservations/${catwaysNumber}`);
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur lors de la recherche", error });
    }
};


//on crée une fonction qui va ajouter un utilisateur
/**
 * Ajoute une nouvelle réservation pour un catway.
 * @async
 * @function add
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body.clientName - Nom du client effectuant la réservation.
 * @param {string} req.body.boatName - Nom du bateau du client.
 * @param {string} req.body.startDate - Date de début de la réservation (format ISO 8601 attendu).
 * @param {string} req.body.endDate - Date de fin de la réservation (format ISO 8601 attendu).
 * @param {string} req.body.catwaysNumber - Numéro du catway à réserver.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Réponse JSON avec un message de succès ou d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème côté serveur.
 * 
 * @description
 * Cette méthode vérifie si une réservation existe déjà pour le catway spécifié.
 * - Si aucune réservation n'existe, elle crée une nouvelle réservation en fonction des données fournies.
 * - Un message de succès ou d'erreur est retourné selon le résultat.
 * - En cas de problème (ex. : serveur ou base de données), une erreur appropriée est renvoyée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (réservation ajoutée ou utilisateur introuvable).
 * - 501 : Erreur serveur lors de la création de la réservation.
 */
exports.add = async (req, res, next) => {
    const clientName = req.body.clientName;
    const boatName = req.body.boatName;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const catwaysNumber = req.body.catwaysNumber;


    try {
        // Vérifier si l'utilisateur existe
        const reservations = await Reservations.findOne({ catwaysNumber: catwaysNumber });

        if (reservations || !reservations) {
            // Création de la réservation
            const newReservation = await Reservations.create({
                catwaysNumber: catwaysNumber,
                clientName: clientName,
                boatName: boatName,
                startDate: startDate,
                endDate: endDate
            });

            // Formatage des dates pour le message de succès
            const formattedStartDate = new Date(newReservation.startDate).toISOString().split('T')[0];
            const formattedEndDate = new Date(newReservation.endDate).toISOString().split('T')[0];

            // Message de succès
            console.log("METHOD reservation add = élément ajouté avec succès", newReservation);
            req.session.successMessage = `Catway n° :"${newReservation.catwaysNumber}" réservé du : " ${formattedStartDate}" au : "${formattedEndDate}" avec succès.`;
            return res.status(200).json({ message: 'catway réservé avec succés', redirectUrl: `/admin/reservations/${catwaysNumber}` });
        } else {
            req.session.errorMessage = `Réservation impossible, catway introuvable.`;
            console.log('Utilisateur introuvable :', clientName);
            return res.status(200).json({ message: 'Réservation impossible, utilisateur introuvable.', redirectUrl: `/admin/reservations` });
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de la réservation :", error);
        return res.status(501).json({ message: "Erreur serveur lors de l'ajout de la réservation.", error });
    }
};



//on crée une fonction qui va modifier un utilisateur



/**
 * Met à jour les informations d'une réservation existante pour un catway.
 * @async
 * @function update
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body._id - L'ID unique de la réservation à mettre à jour.
 * @param {string} req.body.catwaysNumber - Numéro du catway concerné.
 * @param {string} req.body.startDate - Nouvelle date de début de la réservation (format ISO 8601 attendu).
 * @param {string} req.body.endDate - Nouvelle date de fin de la réservation (format ISO 8601 attendu).
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Réponse JSON avec un message de succès ou d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou de validation.
 * 
 * @description
 * Cette méthode met à jour une réservation existante en fonction de l'ID fourni. 
 * - Si la réservation existe, ses valeurs sont mises à jour avec les nouvelles données envoyées.
 * - Si une autre réservation occupe déjà les mêmes dates pour le catway, une erreur est retournée.
 * - En cas de succès, un message confirmant la mise à jour est renvoyé.
 * - En cas d'erreur serveur ou si la réservation n'est pas trouvée, un message approprié est renvoyé.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (mise à jour réussie ou erreur de validation des dates).
 * - 501 : Erreur serveur.
 */
exports.update = async (req, res, next) => {
    const id = req.body._id;
    const newReservation = req.body;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const catwaysNumber = req.body.catwaysNumber;

    try {
        let reservations = await Reservations.findOne({ _id: id });
        if (reservations) {
            Object.keys(newReservation).forEach((key) => {
                if (!!newReservation[key]) {
                    reservations[key] = newReservation[key];
                }
                else {
                    req.session.errorMessage = 'impossible de trouvé la réservation a mettre a jour';
                    return res.redirect(`/admin/reservations`);
                }
            });

            if (catwaysNumber === reservations.catwaysNumber && startDate === reservations.startDate && endDate === reservations) {
                req.session.errorMessage = `catway n° : ${catwaysNumber} deja occupé du : ${formattedStartDate} au : ${formattedEndDate}.`;
                return res.status(200).json({ message: 'catway déja réservé a la date selectionné', redirectUrl: `/admin/reservations/${catwaysNumber}` });
            }


            await reservations.save();

            const formattedStartDate = new Date(newReservation.startDate).toISOString().split('T')[0];
            const formattedEndDate = new Date(newReservation.endDate).toISOString().split('T')[0];


            req.session.successMessage = `réservation de : ${reservations.clientName} mis a jour avec entrée le : ${formattedStartDate} sortie le : ${formattedEndDate}`;
            return res.status(200).json({ message: 'Réservation mis a jour avec succès', redirectUrl: `/admin/reservations/${catwaysNumber}` });
        } else {
            console.log('METHOD reservation update = object reservation introuvable');
            return res.status(200).json({ message: 'object reservation introuvable', redirectUrl: `/admin/reservations` });
        }
    } catch (error) {
        return res.status(501).json({ message: "METHOD reservation update = serveur introuvable", error });
    }
};

/**
 * Supprime une réservation existante pour un catway.
 * @async
 * @function delete
 * @memberof module:reservations
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body._id - L'ID unique de la réservation à supprimer.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Réponse JSON avec un message de succès ou d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou de suppression échouée.
 * 
 * @description
 * Cette méthode supprime une réservation existante dans la base de données en fonction de son ID.
 * - Si la réservation existe, elle est supprimée, et un message de succès est renvoyé.
 * - Si aucune réservation n'est trouvée, un message d'erreur est retourné.
 * - En cas de problème serveur, une réponse appropriée avec l'erreur est renvoyée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (réservation supprimée ou non trouvée).
 * - 501 : Erreur serveur lors de la suppression.
 */
exports.delete = async (req, res, next) => {
    const id = req.body._id;
    //const catwaysNumber = req.body.catwaysNumber;

    try {
        const reservation = await Reservations.findOne({ _id: id });

        if (reservation) {

            try {
                const catwaysNumber = reservation.catwaysNumber;
                req.session.catwaysNumber = catwaysNumber;

                if (Number(catwaysNumber) === 0) {
                    req.session.successMessage = `Catway supprimé avec succès`;
                    await Reservations.deleteOne({ _id: id });
                    return res.status(200).json({ message: 'Réservation supprimée avec succès', redirectUrl: `/admin/reservations` });
                } else {
                    req.session.successMessage = `catway n° : ${catwaysNumber} supprimé avec succès`;
                    await Reservations.deleteOne({ _id: id });
                    return res.status(200).json({ message: 'Réservation supprimée avec succès', redirectUrl: `/admin/reservations/${catwaysNumber}` });
                }



            } catch (error) {
                console.log("impossible de supprimer l'objet");
                return res.status(200).json({ message: 'impossible de supprimer l/objet', redirectUrl: `/admin/reservations` });

            }
        } else {
            console.log("method reservation delete disfonctionnel : impossible de supprimer l'objet");
            return res.status(200).json({ message: 'Réservation introuvable', redirectUrl: `/admin/reservations` });
        };


    } catch (error) {
        return res.status(501).json({ message: "METHOD catwaysDelete = serveur introuvable", error });
    }
};
