const Catways = require('../models/catways');
/*
const bcrypt = require('bcrypt');
const { render } = require('ejs');
const jwt = require('jsonwebtoken');
const User = require('../models/users')

const { SECRET_KEY } = process.env;
*/



//on crée une fonction qui va chercher un utilisateur par son id

exports.catwaysGetById = async (req, res, next) => {
    const catwaysNumber = req.params.catwaysNumber || req.body.catwaysNumber;
    try {
        //const catways = await Catways.find({});
        const findCatways = await Catways.findOne({ catwaysNumber: catwaysNumber });
        if (!catwaysNumber) {
            return res.redirect('/admin/catways');
        }
        if (catwaysNumber) {
            return res.redirect(`/admin/catways/${catwaysNumber}`);
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur lors de la recherche", error });
    }
};





//on crée une fonction qui va ajouter un utilisateur
exports.catwaysAdd = async (req, res, next) => {
    const catwaysNumber = req.body.catwaysNumber;
    const {catwaysType, catwaysState } = req.body;

    const newCatway = new Catways({
        catwaysNumber: catwaysNumber,
        catwaysType: catwaysType,
        catwaysState: catwaysState
    });

    try {
        // Vérification si catwaysNumber existe déjà
        const catway = await Catways.findOne({ catwaysNumber: catwaysNumber });

        if (catway){
            console.log('METHOD catwaysAdd = catwaysNumber existe déjà');
            req.session.errorMessage = `Catway n° : ${catwaysNumber} déja existant`;
            return res.redirect(`/admin/catways/${catwaysNumber}`);
        }else{
            try{
                await newCatway.save();
                console.log("METHOD catwaysAdd = élément ajouté avec succès", newCatway);
                req.session.successMessage = `Catway n° ${catwaysNumber} ajouté avec succès`;
                return res.redirect(`/admin/catways/${catwaysNumber}`);
            }catch (error) {
                req.session.errorMessage = `impossible d/ajouter l/utilateur`;
                return res.redirect(`/admin/catways`);
            }
        };    
    } catch (error) {
        return res.status(501).json({ message: "METHOD catwaysAdd = serveur introuvable", error });
    }
};


//on crée une fonction qui va modifier un utilisateur




exports.CatwaysUpdate = async (req, res, next) => {
    const id = req.body._id;
    const newCatway = req.body;

    try {
        let catway = await Catways.findOne({_id: id});
        if (catway) {
            Object.keys(newCatway).forEach((key) => {
                if(!!newCatway[key]) {
                    catway[key] = newCatway[key];
                }
                else{
                    req.session.errorMessage = 'impossible de trouvé le profil a mettre a jour';
                    return res.redirect(`/admin/catways`);
                }});
            await catway.save();
            req.session.successMessage = `Catway n° ${catway.catwaysNumber} mis a jour avec succès`;
            return res.redirect(`/admin/catways/${catway.catwaysNumber}`);
        }else{
            console.log('METHOD CatwaysUpdate = object catway introuvable' );
            return res.redirect(`/admin/catways`); // Gère le cas où l'objet n'est pas trouvé
        }
    } catch (error) {
        return res.status(501).json({ message: "METHOD CatwaysUpdate = serveur introuvable" , error });
    }
};

exports.catwaysDelete = async (req, res, next) => {
        const catwaysNumber = req.body.catwaysNumber;

    try {
        let catway = await Catways.findOne({ catwaysNumber: catwaysNumber });
        if(catway){
            try {
                req.session.successMessage = `Catway n° ${catwaysNumber} supprimé avec succès`;
                await Catways.deleteOne({ catwaysNumber: catwaysNumber });
                return res.redirect(`/admin/catways`);

            }catch(error){
                console.log("impossible de supprimer l'objet");
                return res.redirect(`/admin/catways`);
                
            }
        }else{
            console.log("method delete disfonctionnel : impossible de supprimer l'objet");
            return res.redirect(`/admin/catways`);
        };

                
    } catch(error){
        return res.status(501).json({ message: "METHOD catwaysDelete = serveur introuvable" , error });
    }
};
