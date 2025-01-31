const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

// authenticate est une fonction qui va permettre de vérifier si un utilisateur existe et si le mot de passe est correct
exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    try{
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user){
            bcrypt.compare(password, user.password, function(err, response){
                if (err) {
                    throw new Error(err);
            }
            if(response){
                delete user._doc.password;

                const expireIn = 24 * 60 * 60;
                const token = jwt.sign({
                    user: user
                },
            SECRET_KEY,
            {
                expiresIn: expireIn
            });

            // Ajout d'un espace après 'Bearer'
            res.header('Authorization', 'Bearer ' + token);

            return res.render('adminusers');
        }

        return res.status(403).json('Authentification echouée');
    });
    } else {
        return res.status(404).json('Utilisateur non trouvé');
    }
} catch (error) {
    return res.status(501).json({message: "erreur du serveur interne", erreur: error});
}
}



//on crée une fonction qui va chercher un utilisateur par son id
exports.getById = async (req, res, next) => {
    const id = req.params.id;

    try {
        let user = await User.findById(id);

        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json('Utilisateur introuvable');
        } catch (error) {
            return res.status(500).json(error);
        }
    };

//on crée une fonction qui va ajouter un utilisateur
    exports.add = async (req, res, next) => {

        const temp = ({
            name: req.body.name,
            firstname: req.body.firstname,
            email: req.body.email,
            password: req.body.password
        });

        try {
            let user = await User.create(temp);

            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

//on crée une fonction qui va modifier un utilisateur

    exports.update = async (req, res, next) => {
        const id = req.params.id;

        const temp = ({
            name: req.body.name,
            firstname: req.body.firstname,
            email: req.body.email,
            password: req.body.password
        });

        try {
            let user = await User.findOne({_id : id});

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

exports.delete = async (req, res, next) => {
    const id = req.params.id;

    try {
        await User.deleteOne({ _id: id});

        return res.status(204).json('delete_ok');
    } catch (error) {
        return res.status(501).json(error);
    }
}



