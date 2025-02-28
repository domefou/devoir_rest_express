const Catways = require('../models/catways');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcrypt');

const { SECRET_KEY } = process.env;

exports.authenticate = async (req, res, next) => {
    const {email, password} = req.body;

    if (password.length < 8) {
        return res.render('login', {
            errorMessage: 'Le mot de passe doit contenir au moins 8 caractères'
        });
    }

    try {
        let user = await User.findOne({ email: email });
        if(user){
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
            delete user._doc.password;
    
            const expireIn = 24 * 60 * 60;
            const token = jwt.sign({
                user: user
            }, SECRET_KEY, {
                expiresIn: expireIn
            });
    
            res.cookie('token', 'Bearer ' + token, { httpOnly: true, secure: true });
    
            req.decoded = { user: user };
            if (user.role === "admin") {
                return res.redirect('/admin/menu');
              } else {
                return res.redirect('/user/menu');
              }
        }
        else{
            return res.render('login', {
                errorMessage: "mot de passe ou utilisateur incorrect."
            });
        }
        }
        
    } catch (error) {
        return res.status(501).json({ message: "Erreur du serveur interne", erreur: error });
    }
};

   
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
    const { name, firstname, email, password, question, response } = req.body;
    

    if (password.length < 8) {
        return res.render('signup', {
            errorMessage: 'Le mot de passe doit contenir au moins 8 caractères'
        });
    }

    let role;
    if (email === "admin@mail.com") {
        role = "admin";
    } else {
        role = "user";
    }
                const newUser = new User({
                    name,
                    firstname,
                    email,
                    password,
                    role,
                    question,
                    response
                  });
        
            const user = await User.create(newUser);
            req.user = user;
            console.log('utilisateur creé avec succés : ',user.response) //Stocker l'utilisateur dans req pour une utilisation ultérieure
            return next(); // Passer au middleware suivant
        };


exports.passwordUpdate = async (req, res, next) => {
const { email, password, response } = req.body;

    try {
        if (password.length < 8) {
            return res.render('reset', {
            errorMessage: 'Le mot de passe doit contenir au moins 8 caractères'
        });
        }

        let user = await User.findOne({ email: email }, '-__v -updatedAt');
        
        if(user){
            const valideResponse = await bcrypt.compare(response, user.response);
    
        if (valideResponse) {
            console.log('passwordUpdate : Réponse correcte, mise à jour du mot de passe');
        await user.save(password);
        console.log('passwordUpdate : nouveau mdp crypté : ', password);
        return res.redirect('/login');
        } else {
        console.log('passwordUpdate : Question ou réponse incorrecte');
        return res.render('reset',{
            errorMessage : "impossible de mettre a jour le mot de passe"
        })
        }
        }
        
    } catch (error) {
        console.error("passwordUpdate : erreur lors d'utilisation de la method", error);
        return res.render('reset');
    }
}

    exports.update = async (req, res, next) => {
        const id = req.params.id;

        const temp = ({
            name: req.body.name,
            firstname: req.body.firstname,
            email: req.body.email,
            password: req.body.password,
            question : req.body.question,
            response : req.body.response
        });
        
        if (password.length < 8) {
            return res.render('signup', {
              errorMessage: 'le mot de passe ne contient pas les conditions requise' });
            }

        try {
            let user = await User.findOne({_id : id});

            if (user) {
                Object.keys(temp).forEach((key) => {
                    if (!!temp[key]) {
                        user[key] = temp[key];
                    }
                });

                await user.save();
                console.log('mise a jour reussi');
                return next();
                //return res.status(200).json(user);
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


/*
admin
response: $2b$10$NdEY2ZndnKu3LuRsdUxHFuiPHkNyeviaYAyQNiozXnVcodSu6abdm

password: '$2b$10$NJdVjMCEMKOgNRD6DlmVh.3B5OG6/a4eAsK5g4GUSnf/5Zd3w8XkK',

user
response :  $2b$10$6ZtN61nhiUg3h8Oc9YTkiOBpT/4hxKsiG1Ufeh3wXB5v2EuKEkD5G

*/