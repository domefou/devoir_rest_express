const Reservations = require('../models/reservation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

// authenticate est une fonction qui va permettre de vérifier si un utilisateur existe et si le mot de passe est correct


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
exports.add = async (req, res, next) => {
    const clientName = req.body.clientName;
    const boatName = req.body.boatName;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const catwaysNumber = req.body.catwaysNumber;


    try {
        // Vérifier si l'utilisateur existe
        const reservations = await Reservations.findOne({catwaysNumber:catwaysNumber});

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




exports.update = async (req, res, next) => {
    const id = req.body._id;
    const newReservation = req.body;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const catwaysNumber = req.body.catwaysNumber;

    try {
        let reservations = await Reservations.findOne({_id: id});
        if (reservations) {
            Object.keys(newReservation).forEach((key) => {
                if(!!newReservation[key]) {
                    reservations[key] = newReservation[key];
                }
                else{
                    req.session.errorMessage = 'impossible de trouvé la réservation a mettre a jour';
                    return res.redirect(`/admin/reservations`);
                }});

                if(catwaysNumber === reservations.catwaysNumber && startDate === reservations.startDate && endDate === reservations){
                    req.session.errorMessage = `catway n° : ${catwaysNumber} deja occupé du : ${formattedStartDate} au : ${formattedEndDate}.`;
                    return res.status(200).json({ message: 'catway déja réservé a la date selectionné', redirectUrl: `/admin/reservations/${catwaysNumber}` });
                    }


                    await reservations.save();

                    const formattedStartDate = new Date(newReservation.startDate).toISOString().split('T')[0];
                    const formattedEndDate = new Date(newReservation.endDate).toISOString().split('T')[0];


                    req.session.successMessage = `réservation de : ${reservations.clientName} mis a jour avec entrée le : ${formattedStartDate} sortie le : ${formattedEndDate}`;
                    return res.status(200).json({ message: 'Réservation mis a jour avec succès', redirectUrl: `/admin/reservations/${catwaysNumber}` });
        }else{
            console.log('METHOD reservation update = object reservation introuvable' );
            return res.status(200).json({ message: 'object reservation introuvable', redirectUrl: `/admin/reservations` });
        }
    } catch (error) {
        return res.status(501).json({ message: "METHOD reservation update = serveur introuvable" , error });
    }
};


exports.delete = async (req, res, next) => {
        const id = req.body._id;
        const catwaysNumber = req.body.catwaysNumber;

    try {
        let reservation = await Reservations.findOne({ _id: id });
        
        const catwaysNumberBeforeDelete = reservation.catwaysNumber;
        if(reservation){
            try {
                req.session.successMessage = `catway n° : ${catwaysNumberBeforeDelete} supprimé avec succès`;
                await Reservations.deleteOne({ _id: id });
                return res.status(200).json({ message: 'Réservation supprimée avec succès', redirectUrl: `/admin/reservations/${catwaysNumberBeforeDelete}` });

            }catch(error){
                console.log("impossible de supprimer l'objet");
                return res.status(200).json({ message: 'impossible de supprimer l/objet', redirectUrl: `/admin/reservations` });
                
            }
        }else{
            console.log("method reservation delete disfonctionnel : impossible de supprimer l'objet");
            return res.status(200).json({ message: 'Réservation introuvable', redirectUrl: `/admin/reservations` });
        };

                
    } catch(error){
        return res.status(501).json({ message: "METHOD catwaysDelete = serveur introuvable" , error });
    }
};
