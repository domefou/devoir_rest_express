const Catways = require('../models/catways');
const bcrypt = require('bcryptjs');
const { render } = require('ejs');
const jwt = require('jsonwebtoken');
const User = require('../models/users')

const { SECRET_KEY } = process.env;



//on crée une fonction qui va chercher un utilisateur par son id

/**
 * Ajoute une réservation pour un catway.
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
 * @returns {Promise<void>} - Retourne une réponse JSON avec un message de succès ou d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème côté serveur.
 * 
 * @description
 * Cette méthode vérifie si le catway spécifié par `catwaysNumber` existe déjà dans la base de données.
 * - Si le catway est disponible, elle enregistre une nouvelle réservation et retourne un message de succès.
 * - Sinon, elle retourne un message d'erreur.
 * 
 * Exemples de statut :
 * - 200 : Réservation réussie.
 * - 501 : Erreur serveur ou problème inattendu.
 */
exports.catwaysGetById = async (req, res, next) => {
    const catwaysNumber = req.params.catwaysNumber || req.body.catwaysNumber;
    try {
        const findCatways = await Catways.findOne({ catwaysNumber: catwaysNumber });
        if (!findCatways) {
            req.session.errorMessage = `Catway introuvable`;
            return res.redirect('/admin/catways');

        }
        else {
            req.session.successMessage = `Catway n° ${catwaysNumber} trouvé avec succès`;
            return res.redirect(`/admin/catways/${catwaysNumber}`)
        };
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur lors de la recherche", error });
    }
};





//on crée une fonction qui va ajouter un utilisateur

/**
 * Ajoute un nouveau catway.
 * @async
 * @function catwaysAdd
 * @memberof module:catways
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body.catwaysNumber - Numéro du catway à ajouter.
 * @param {string} req.body.catwaysType - Type du catway.
 * @param {string} req.body.catwaysState - État actuel du catway.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Réponse JSON avec un message de succès ou d'erreur.
 * @throws {Error} - En cas de problème serveur ou de sauvegarde.
 * 
 * @description
 * Cette méthode vérifie si le catway avec le numéro spécifié existe déjà dans la base de données.
 * - Si le catway existe, elle retourne une réponse indiquant que le catway est déjà présent.
 * - Sinon, elle crée un nouveau catway dans la base de données.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (catway ajouté ou déjà existant).
 * - 501 : Erreur serveur ou problème inattendu.
 */
exports.catwaysAdd = async (req, res, next) => {
    const catwaysNumber = req.body.catwaysNumber;
    const { catwaysType, catwaysState } = req.body;

    const newCatway = new Catways({
        catwaysNumber: catwaysNumber,
        catwaysType: catwaysType,
        catwaysState: catwaysState
    });

    try {
        // Vérification si catwaysNumber existe déjà
        const catway = await Catways.findOne({ catwaysNumber: catwaysNumber });

        if (catway) {
            console.log('METHOD catwaysAdd = catwaysNumber existe déjà');
            req.session.errorMessage = `Catway n° : ${catwaysNumber} déja existant`;
            return res.status(200).json({ message: 'catway déja existant', redirectUrl: `/admin/catways/${catwaysNumber}` });
        } else {
            try {
                await newCatway.save();
                console.log("METHOD catwaysAdd = élément ajouté avec succès", newCatway);
                req.session.successMessage = `Catway n° ${catwaysNumber} ajouté avec succès`;
                return res.status(200).json({ message: 'élément ajouté avec succès', redirectUrl: `/admin/catways/${catwaysNumber}` });
            } catch (error) {
                req.session.errorMessage = `impossible d/ajouter l/utilateur`;
                return res.status(200).json({ message: 'impossible d/ajouter l/utilateur', redirectUrl: `/admin/catways` });
            }
        };
    } catch (error) {
        return res.status(501).json({ message: "METHOD catwaysAdd = serveur introuvable", error });
    }
};


//on crée une fonction qui va modifier un utilisateur

/**
 * Met à jour les informations d'un catway existant.
 * @async
 * @function CatwaysUpdate
 * @memberof module:catways
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body._id - L'ID unique du catway à mettre à jour.
 * @param {Object} req.body - Les nouvelles données pour le catway (ex. type, état, etc.).
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Réponse JSON avec un message de succès ou d'erreur.
 * @throws {Error} - En cas de problème serveur ou d'échec de la mise à jour.
 * 
 * @description
 * Cette méthode cherche un catway existant dans la base de données par son ID.
 * - Si le catway est trouvé, ses propriétés sont mises à jour avec les nouvelles valeurs fournies.
 * - Si le catway n'est pas trouvé, une réponse avec un message d'erreur est retournée.
 * - En cas d'erreur serveur, une réponse appropriée est renvoyée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (mise à jour effectuée ou catway introuvable).
 * - 501 : Erreur serveur.
 */
exports.CatwaysUpdate = async (req, res, next) => {
    const id = req.body._id;
    const newCatway = req.body;


    try {
        let catway = await Catways.findOne({ _id: id });
        if (catway) {
            Object.keys(newCatway).forEach((key) => {
                if (!!newCatway[key]) {
                    catway[key] = newCatway[key];
                }
                else {
                    req.session.errorMessage = 'impossible de trouvé le profil a mettre a jour';
                    return res.status(200).json({ message: 'impossible de trouvé le profil a mettre a jour', redirectUrl: `/admin/catways` });
                }
            });
            await catway.save();
            const catwaysNumber = catway.catwaysNumber;
            req.session.successMessage = `Catway n° ${catwaysNumber} mis a jour avec succès`;
            return res.status(200).json({ message: 'catway dajouté avec succés', redirectUrl: `/admin/catways/${catwaysNumber}` });
        } else {
            console.log('METHOD CatwaysUpdate = object catway introuvable');
            return res.status(200).json({ message: 'object catway introuvable', redirectUrl: `/admin/catways` }); // Gère le cas où l'objet n'est pas trouvé
        }
    } catch (error) {
        return res.status(501).json({ message: "METHOD CatwaysUpdate = serveur introuvable", error });
    }
};



/**
 * Supprime un catway existant par son ID.
 * @async
 * @function delete
 * @memberof module:catways
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body._id - L'ID unique du catway à supprimer.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Réponse JSON avec un message de succès ou d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou d'échec de suppression.
 * 
 * @description
 * Cette méthode recherche un catway existant dans la base de données par son ID.
 * - Si le catway est trouvé, il est supprimé de la base de données et un message de succès est renvoyé.
 * - Si le catway n'est pas trouvé, une réponse avec un message d'erreur est retournée.
 * - Gère également les erreurs serveur ou les problèmes lors de l'opération de suppression.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (catway supprimé ou non trouvé).
 * - 501 : Erreur serveur.
 */
exports.delete = async (req, res) => {
    const id = req.body._id;


    try {
        let catway = await Catways.findOne({ _id: id });
        console.log("DELETE catway trouvé : ", catway);
        if (catway) {
            const catwaysNumber = catway.catwaysNumber;
            req.params.catwaysNumber = catwaysNumber;

            try {
                req.session.successMessage = `catway n° : ${catwaysNumber} supprimé avec succès`;
                await Catways.deleteOne({ _id: id });
                return res.status(200).json({ message: 'Catway supprimée avec succès', redirectUrl: `/admin/catways/${catwaysNumber}` });

            } catch (error) {
                console.log("impossible de supprimer l'objet");
                return res.status(200).json({ message: 'impossible de supprimer l/objet', redirectUrl: `/admin/catways` });

            }
        } else {
            console.log("method catways delete disfonctionnel : impossible de supprimer l'objet");
            return res.status(200).json({ message: 'Réservation introuvable', redirectUrl: `/admin/catways` });
        };


    } catch (error) {
        return res.status(501).json({ message: "METHOD catwaysDelete = serveur introuvable", error });
    }
};
