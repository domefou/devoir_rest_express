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
    const name = req.params.name || req.body.name;

    try {
        let user = await User.findOne({name: name});

        if (user) {
            return res.redirect(`/admin/user/${name}`)
        }
        return res.redirect(`/admin/user`);
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
            console.log('utilisateur creé avec succés : ',user) //Stocker l'utilisateur dans req pour une utilisation ultérieure
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

exports.userUpdate = async (req, res, next) => {
    const id = req.params.id;
    const newUser = req.body;


    try {
        let user = await User.findOne({ _id: id });

        if (user) {
            Object.keys(newUser).forEach((key) => {
                if (!!newUser[key]) {
                    user[key] = newUser[key];
                }
            });
            await user.save(); // Enregistre l'objet mis à jour
                console.log("METHOD CatwaysUpdate = élément mis a jour avec succés" , newUser);
            return next();
            

            
        } else {
            return res.status(404).json({ message: 'METHOD CatwaysUpdate = object catway introuvable' }); // Gère le cas où l'objet n'est pas trouvé
        }
    } catch (error) {
        return res.status(501).json({ message: "METHOD CatwaysUpdate = serveur introuvable" , error });
    }
}


    
//on crée une fonction qui va supprimer un utilisateur


    




exports.userDelete = async (req, res, next) => {
        const email = req.body.email;


    try {
            let user = await User.findOne({ email: email });
        console.log(user);
        
                try {
                    if(user){
                    await User.deleteOne({ email: email});
                        console.log("METHOD catwaysDelete = élément supprimé avec succés");
                        req.session.successMessage = `utilisateur : ${user.name} supprimé avec succès`;
                    return res.redirect(`/admin/user`);
                } }
                catch (error) {
                        console.log("impossible de supprimer l'objet");
                    return res.redirect(`/admin/user`);
                    
                }
        } catch (error) {
        return res.status(501).json({ message: "METHOD catwaysDelete = serveur introuvable" , error });
        }
};


/*
admin
response: $2b$10$NdEY2ZndnKu3LuRsdUxHFuiPHkNyeviaYAyQNiozXnVcodSu6abdm

password: '$2b$10$NJdVjMCEMKOgNRD6DlmVh.3B5OG6/a4eAsK5g4GUSnf/5Zd3w8XkK',

user
response :  $2b$10$6ZtN61nhiUg3h8Oc9YTkiOBpT/4hxKsiG1Ufeh3wXB5v2EuKEkD5G

*/


/***************************************************ROUTE USER "ADD et PUT" SPECIAL ADMIN ****************************************/


exports.adminAdd = async (req, res, next) => {
    const { name, firstname, email, password, question, response } = req.body;
    

    if (password.length < 8) {
        req.session.successMessage = `'Le mot de passe doit contenir au moins 8 caractères'`;
        return res.redirect('/admin/user');
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

            if(user){
                req.session.successMessage = `Utilisateur : ${newUser.name} ajouté avec succès !`;
                console.log("METHOD adminUserUpdate = ajouté avec succés" , newUser);
            return res.redirect(`/admin/user/${newUser.name}`);

            }

            console.log('METHOD adminUserUpdate = object user introuvable');
            return res.redirect(`/admin/user`);
        };




exports.adminUserUpdate = async (req, res, next) => {
    const nameId = req.params.name;
    const email = req.body.email;
    const newUser = req.body;


    try {
        let user = await User.findOne({ email: email });

        if (user) {
            Object.keys(newUser).forEach((key) => {
                if (!!newUser[key]) {
                    user[key] = newUser[key];
                }
            });
            await user.save(); // Enregistre l'objet mis à jour
                console.log("METHOD CatwaysUpdate = élément mis a jour avec succés" , newUser);
            return res.redirect(`/admin/user/${nameId}`);
            

            
        } else {
            console.log('METHOD CatwaysUpdate = object catway introuvable');
            return res.redirect(`/admin/user`);
             // Gère le cas où l'objet n'est pas trouvé
        }
    } catch (error) {
        return res.status(501).json({ message: "METHOD CatwaysUpdate = serveur introuvable" , error });
    }
};


exports.adminDecryptUpdate = async (req, res, next) => {
    const newUser = req.body;
    const email = req.body.email;

    try {
        // Vérification du mot de passe
        if (newUser.password && newUser.password.length < 8) {
            return res.render('reset', {
                errorMessage: 'Le mot de passe doit contenir au moins 8 caractères'
            });
        }

        // Recherche de l'utilisateur dans la base de données
        let user = await User.findOne({ email: email }, '-__v -updatedAt');
        if (!user) {
            req.session.successMessage = `Utilisateur introuvable avec cet email`;
            return res.redirect('/admin/user');
        }

        
            const validations = [
                
                { isValid: await bcrypt.compare(newUser.password, user.password), message: 'mot de passe incorrect' }
                /*,
                { isValid: question === user.question, message: 'question secret incorrect'},
                { isValid: await bcrypt.compare(newUser.response, user.response), message: 'réponse secrète incorrecte' }*/
            ];

        // Validation des champs sécurisés
        

        for (const validation of validations) {
            if (!validation.isValid) {
                req.session.successMessage = validation.message;
                return res.redirect('/admin/user');
            }
        }

        // Mise à jour de l'utilisateur
        Object.keys(newUser).forEach((key) => {
            if (!!newUser[key]) {
                user[key] = newUser[key];
            }
        });

        console.log('Utilisateur correct, prêt pour la fonction : save()');
        await user.save();

        req.session.successMessage = `Utilisateur : ${user.name} mis à jour avec succès`;
        return res.redirect(`/admin/user/${user.name}`);
    } catch (error) {
        console.error("adminDecryptUpdate : erreur lors de l'utilisation de la méthode", error);
        req.session.successMessage = `Une erreur est survenue`;
        return res.redirect('/admin/user');
    }
};

        