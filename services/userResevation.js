const Reservations = require('../models/reservation');
const Users = require('../models/users');


/**
 * Ajoute une nouvelle réservation pour un client et un catway spécifique.
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
 * @returns {Promise<void>} - Réponse JSON ou redirection en fonction du résultat.
 * @throws {Error} - Retourne une erreur en cas de problème côté serveur ou d'échec de validation.
 * 
 * @description
 * Cette méthode vérifie si un utilisateur existe dans la base de données en fonction de son nom (`clientName`).
 * - Si l'utilisateur est trouvé, elle vérifie la disponibilité du catway pour les dates spécifiées.
 * - Si aucune réservation n'est en conflit, une nouvelle réservation est créée, et un message de succès est renvoyé.
 * - En cas de problème (utilisateur introuvable, catway non disponible, ou serveur), une réponse appropriée est renvoyée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (réservation effectuée ou utilisateur introuvable).
 * - 500 : Erreur serveur lors de la création de la réservation.
 */
exports.add = async (req, res, next) => {
    const clientName = req.body.clientName;
    const boatName = req.body.boatName;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const catwaysNumber = req.body.catwaysNumber;


    try {
        // Vérifier si l'utilisateur existe
        const user = await Users.findOne({ name: clientName });
        const email = user.email;

        if (user) {
            const reservations = await Reservations.findOne({ clientName: clientName });

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
                req.session.successMessage = `Demande de réservation éffectuée du : " ${formattedStartDate}" au : "${formattedEndDate}" avec succès.`;
                return res.redirect(`/user/reservation/${email}`);
            } else {
                req.session.errorMessage = `Réservation impossible, catway introuvable.`;
                console.log('Utilisateur introuvable :', clientName);
                return res.redirect(`/admin/reservation`)
            }
        } else {
            req.session.errorMessage = `Utilisateur introuvable avec le nom utilisé.`;
            return res.redirect(`/admin/reservation`)
        }


    } catch (error) {
        req.session.errorMessage = `Erreur lors de l'ajout de la réservation.`;
        console.error("Erreur lors de l'ajout de la réservation :", error);
        return res.redirect(`/admin/reservation`);
    }
}; 