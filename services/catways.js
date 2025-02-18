const Catways = require('../models/catways');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;




//on crée une fonction qui va chercher un utilisateur par son id
exports.catwaysGetById = async (req, res, next) => {
    const id = req.params.id;

    try {
        let user = await Catways.findById(id);

        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json('Utilisateur introuvable');
        } catch (error) {
            return res.status(500).json(error);
        }
    };

//on crée une fonction qui va ajouter un utilisateur
    exports.catwaysAdd = async (req, res, next) => {
        const temp = ({
            catwaysNumber: req.body.catwaysNumber,
            catwaysType: req.body.catwaysType,
            catwaysState: req.body.catwaysState
        });

        try {
            let user = await Catways.create(temp);
            console.log("creation reussi" + user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

//on crée une fonction qui va modifier un utilisateur

    exports.catwaysUpdate = async (req, res, next) => {
        const id = req.params.id;

        const temp = ({
            number: req.body.number,
            type: req.body.type,
            state: req.body.state
        });

        try {
            let user = await Catways.findOne({_id : id});

            if (user) {
                Object.keys(temp).forEach((key) => {
                    if (!!temp[key]) {
                        user[key] = temp[key];
                    }
                });

                await user.save();
                return res.status(200).json(user);
        }

        return res.status(404).json('Utilisateur introuvable');
    } catch (error) {
        return res.status(501).json(error);
    }
}

//on crée une fonction qui va supprimer un utilisateur

exports.catwaysDelete = async (req, res, next) => {
    const id = req.params.id;

    try {
        await Catways.deleteOne({ _id: id});

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}

