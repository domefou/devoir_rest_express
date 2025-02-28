const Catways = require('../models/catways');
const bcrypt = require('bcrypt');
const { render } = require('ejs');
const jwt = require('jsonwebtoken');
const User = require('../models/users')

const { SECRET_KEY } = process.env;




//on crée une fonction qui va chercher un utilisateur par son id
exports.catwayGetById = async (req, res, next) => {
    const id = req.params.id;

    try {
        if(id){
            
        const catway = await Catways.findById(id);
        console.log("METHOD catwayGetById = élément touvé" , catway );
        }
        else{
            return res.status(404).json({message : "METHOD catwayGetById = utilisateur introuvable" , error});
        }
        }catch (error) {
            return res.status(501).json({ message: "METHOD catwayGetById = serveur introuvable" , error });
        }
    };

//on crée une fonction qui va ajouter un utilisateur
    exports.catwaysAdd = async (req, res, next) => {

        const { catwaysNumber, catwaysType, catwaysState } = req.body;
        
        const newNumber = req.body.catwaysNumber;

        
        const newCatway = new Catways({
            catwaysNumber: catwaysNumber,
            catwaysType: catwaysType,
            catwaysState: catwaysState
            });

        try {
            const existingCatway = await Catways.findOne({ catwaysNumber: catwaysNumber });

            if(existingCatway){
                const catways = await Catways.find({});
                const user = req.decoded;

                res.render('adminCatways', {
                    catways: catways,
                    user: user,
                    errorMessage: 'Catway déjà utilisé'
                });
                
            }
            else{
                await newCatway.save();
                console.log("METHOD catwaysAdd = élément ajouté avec succés" , newCatway);}

        } catch (error) {
            return res.status(501).json({ message: "METHOD catwaysAdd = serveur introuvable" , error });
        }
    }

//on crée une fonction qui va modifier un utilisateur

exports.CatwaysUpdate = async (req, res, next) => {
    const id = req.body.catwaysId;
    const newCatway = req.body;


    try {
        let catway = await Catways.findOne({ _id: id });

        if (catway) {
            Object.keys(newCatway).forEach((key) => {
                if (!!newCatway[key]) {
                    catway[key] = newCatway[key];
                }
            });
            await catway.save(); // Enregistre l'objet mis à jour
                console.log("METHOD CatwaysUpdate = élément mis a jour avec succés" , newCatway);
            

            
        } else {
            return res.status(404).json({ message: 'METHOD CatwaysUpdate = object catway introuvable' }); // Gère le cas où l'objet n'est pas trouvé
        }
    } catch (error) {
        return res.status(501).json({ message: "METHOD CatwaysUpdate = serveur introuvable" , error });
    }
}


    exports.catwaysDelete = async (req, res, next) => {
        const id = req.params.id;
    
        try {
            const result = await Catways.deleteOne({ _id: id });
                console.log("METHOD catwaysDelete = élément supprimé avec succés" , id);
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'METHOD catwaysDelete = élement inexistant' });
            }
        } catch (error) {
            return res.status(501).json({ message: "METHOD catwaysDelete = serveur introuvable" , error });
        }
    };