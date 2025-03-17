const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcrypt');

const { SECRET_KEY } = process.env;

/**
 * Authentifie un utilisateur en fonction de son email et de son mot de passe.
 * @async
 * @function authenticate
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body.email - L'adresse email de l'utilisateur.
 * @param {string} req.body.password - Le mot de passe de l'utilisateur.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Redirige vers le tableau de bord ou la page de connexion, selon le résultat.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou de validation.
 * 
 * @description
 * Cette méthode vérifie les informations d'identification fournies par l'utilisateur.
 * - Si le mot de passe est trop court, un message d'erreur est affiché.
 * - Si l'utilisateur est trouvé dans la base de données, son mot de passe est comparé avec le mot de passe haché enregistré.
 *   - Si les mots de passe correspondent, un jeton JWT est généré et stocké dans un cookie.
 *   - Si l'utilisateur est un administrateur, il est redirigé vers le tableau de bord administrateur.
 *   - Sinon, il est redirigé vers le tableau de bord utilisateur.
 * - Si les informations d'identification ne sont pas valides ou si l'utilisateur n'est pas trouvé, un message d'erreur est retourné.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (authentification réussie et redirection).
 * - 501 : Erreur serveur (problème inattendu).
 */
exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    if (password.length < 8) {
        return res.render('login', {
            errorMessage: 'Le mot de passe doit contenir au moins 8 caractères'
        });
    }

    try {
        let user = await User.findOne({ email: email });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                delete user._doc.password;

                const expireIn = 24 * 60 * 60;
                const token = jwt.sign(
                    { user: user },
                    SECRET_KEY,
                    { expiresIn: expireIn });

                res.cookie('token', 'Bearer ' + token, { httpOnly: true, secure: true });

                req.decoded = { user: user };
                if (user.role === "admin") {
                    return res.redirect('/admin/menu');
                } else {
                    return res.redirect('/user/menu');
                }
            } else {
                return res.render('login', {
                    errorMessage: "Mot de passe incorrect."
                });
            }
        } else {
            return res.render('login', {
                errorMessage: "Adresse email incorrect."
            });
        }
    } catch (error) {
        return res.status(501).json({ message: "Erreur du serveur interne", erreur: error });
    }
};


//on crée une fonction qui va chercher un utilisateur par son id

/**
 * Récupère un utilisateur en fonction de son nom ou de son email.
 * @async
 * @function getById
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.params - Les paramètres de l'URL.
 * @param {string} [req.params.name] - Nom de l'utilisateur (optionnel).
 * @param {string} [req.params.email] - Email de l'utilisateur (optionnel).
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} [req.body.name] - Nom de l'utilisateur (optionnel).
 * @param {string} [req.body.email] - Email de l'utilisateur (optionnel).
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Redirige vers la page utilisateur ou renvoie une erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur.
 * 
 * @description
 * Cette fonction permet de rechercher un utilisateur dans la base de données à partir de son nom ou de son email. 
 * - Si l'email est fourni, elle recherche l'utilisateur correspondant et redirige vers sa page.
 * - Si le nom est fourni, elle effectue une recherche similaire et redirige en fonction de l'email de l'utilisateur trouvé.
 * - Si aucun email ou nom n'est fourni, elle affiche un message d'erreur.
 * - Si l'utilisateur est introuvable, une erreur est renvoyée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (utilisateur trouvé et redirection effectuée).
 * - 500 : Erreur serveur.
 */
exports.getById = async (req, res, next) => {
    let name = req.params.name || req.body.name;
    let email = req.params.email || req.body.email;

    try {
        if (email) {
            let userEmail = await User.findOne({ email: email });
            if (userEmail) {
                req.session.successMessage = `Utilisateur trouvé.`;
                return res.redirect(`/admin/user/${email}`);
            }
        }
        if (name) {
            let userName = await User.findOne({ name: name });
            if (userName) {
                const email = userName.email;
                req.session.successMessage = `Utilisateur trouvé.`;
                return res.redirect(`/admin/user/${email}`);
            }
        }
        if (!email && !name) {
            req.session.errorMessage = `veuillez saisir un nom ou un email.`;
            return res.redirect(`/admin/user`);
        }
        else {
            req.session.errorMessage = `Utilisateur introuvable.`;
            console.log("Redirection vers : /admin/user");
            return res.redirect(`/admin/user`);
        }
    } catch (error) {
        console.error("Erreur dans getById :", error);
        return res.status(500).json({ error: error.message });
    }
};



//on crée une fonction qui va ajouter un utilisateur

/**
 * Ajoute un nouvel utilisateur au système.
 * @async
 * @function add
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body.name - Le nom de famille de l'utilisateur.
 * @param {string} req.body.firstname - Le prénom de l'utilisateur.
 * @param {string} req.body.email - L'adresse email de l'utilisateur.
 * @param {string} req.body.password - Le mot de passe de l'utilisateur (doit contenir au moins 8 caractères).
 * @param {string} req.body.question - La question secrète de l'utilisateur pour la récupération du mot de passe.
 * @param {string} req.body.response - La réponse à la question secrète.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Appelle la fonction middleware suivante ou affiche une erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou de validation.
 * 
 * @description
 * Cette méthode ajoute un utilisateur en fonction des données fournies dans le corps de la requête. 
 * - Si le mot de passe est trop court, elle affiche un message d'erreur.
 * - Elle attribue un rôle `admin` si l'email correspond à `admin@mail.com`, sinon `user`.
 * - Un nouvel utilisateur est créé avec les informations fournies.
 * - En cas de succès, la fonction middleware suivante est appelée.
 * - En cas d'échec, elle affiche un message d'erreur sur la page d'inscription.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (nouvel utilisateur créé).
 * - 500 : Erreur serveur ou problème de validation.
 */
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

    try {
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
        console.log('utilisateur creé avec succés : ', user)
        return next();
    } catch (error) {
        console.log('Erreur lors de la création du profil.')
        return res.render('signup', {
            errorMessage: 'Erreur lors de la création du profil.'
        });
    }
};

/**
 * Met à jour le mot de passe d'un utilisateur en fonction de son email et de sa réponse secrète.
 * @async
 * @function passwordUpdate
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body.email - L'adresse email de l'utilisateur.
 * @param {string} req.body.password - Le nouveau mot de passe de l'utilisateur (doit contenir au moins 8 caractères).
 * @param {string} req.body.response - La réponse à la question secrète.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Redirige vers la page de connexion en cas de succès, ou vers la page de réinitialisation avec un message d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou d'échec de validation.
 * 
 * @description
 * Cette fonction vérifie et met à jour le mot de passe d'un utilisateur.
 * - Vérifie que le mot de passe fourni contient au moins 8 caractères.
 * - Recherche l'utilisateur dans la base de données en fonction de son email.
 * - Compare la réponse fournie avec la réponse secrète enregistrée dans la base de données.
 *   - Si la réponse est correcte, met à jour le mot de passe et redirige vers la page de connexion.
 *   - Si la réponse est incorrecte, affiche un message d'erreur sur la page de réinitialisation.
 * - En cas d'email introuvable ou d'erreur serveur, retourne un message d'erreur approprié.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (mot de passe mis à jour).
 * - 500 : Erreur serveur.
 */
exports.passwordUpdate = async (req, res, next) => {
    const { email, password, response } = req.body;

    try {
        if (password.length < 8) {
            return res.render('reset', {
                errorMessage: 'Le mot de passe doit contenir au moins 8 caractères'
            });
        }

        let user = await User.findOne({ email: email }, '-__v -updatedAt');
        if (user) {

            const valideResponse = await bcrypt.compare(response, user.response);
            if (valideResponse) {
                console.log('passwordUpdate : Réponse correcte, mise à jour du mot de passe');
                await user.save(password);
                return res.redirect('/login');
            } else {
                console.log('PasswordUpdate :réponse secrète incorrecte.');
                return res.render('reset', {
                    errorMessage: "Réponse secrète incorrecte."
                })
            }
        } else {
            return res.render('reset', {
                errorMessage: "Adresse email incorrect."
            })
        }
    } catch (error) {
        console.error("passwordUpdate : erreur lors d'utilisation de la method", error);
        return res.render('reset');
    };
};

/***************************************************ROUTE USER "ADD / PUT / DELETE" SPECIAL ADMIN ****************************************/

/**
 * Ajoute un nouvel utilisateur administrateur ou utilisateur standard.
 * @async
 * @function adminAdd
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body.name - Nom de famille de l'utilisateur.
 * @param {string} req.body.firstname - Prénom de l'utilisateur.
 * @param {string} req.body.email - Adresse email de l'utilisateur.
 * @param {string} req.body.password - Mot de passe de l'utilisateur (doit contenir au moins 8 caractères).
 * @param {string} req.body.question - Question secrète pour la récupération du mot de passe.
 * @param {string} req.body.response - Réponse à la question secrète.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Retourne une réponse JSON ou effectue une redirection en fonction du résultat.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou d'échec de validation.
 * 
 * @description
 * Cette méthode permet d'ajouter un nouvel utilisateur avec les rôles "admin" ou "user".
 * - Si le mot de passe est trop court, elle redirige avec un message d'erreur.
 * - Si un utilisateur avec le même email n'existe pas, elle crée un nouvel utilisateur avec les données fournies.
 * - Si un utilisateur avec le même email existe déjà, un message d'erreur est renvoyé.
 * - En cas de succès, un message de confirmation est affiché et une redirection est effectuée.
 * - En cas d'erreur lors de la vérification ou de la création, un message d'erreur est retourné.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (utilisateur ajouté ou utilisateur existant).
 * - 501 : Erreur serveur lors de la vérification ou de la création.
 */
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

    try {
        // Vérification si l'utilisateur existe déjà
        const findUser = await User.findOne({ email: email });
        console.log('user : ', findUser);

        if (!findUser) {
            try {
                const newUser = await User.create({
                    name,
                    firstname,
                    email,
                    password,
                    role,
                    question,
                    response
                });

                req.session.email = email;

                console.log("METHOD userAdd = élément ajouté avec succès", newUser);
                req.session.successMessage = `Utilisateur ajouté avec succès.`;
                return res.status(200).json({ message: 'élément ajouté avec succès', redirectUrl: `/admin/user/${email}` });
            } catch (error) {
                req.session.errorMessage = `impossible d'ajouter l'utilisateur.`;
                return res.status(200).json({ message: "impossible d'ajouter l'utilisateur", redirectUrl: `/admin/user` });
            }
        } else {
            console.log('Utilisateur existe déjà');
            req.session.errorMessage = `Un utilisateur avec l'email : "${email}" existe déja.`;
            return res.status(200).json({ message: 'Utilisateur déjà existant', redirectUrl: `/admin/user/${email}` });
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur : ", error);
        return res.status(501).json({ message: "Erreur serveur", error });
    }
};


/**
 * Met à jour les informations d'un utilisateur administrateur ou standard.
 * @async
 * @function adminUpdate
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body.email - L'adresse email de l'utilisateur à mettre à jour.
 * @param {string} [req.body.password] - Le nouveau mot de passe de l'utilisateur (doit contenir au moins 8 caractères si fourni).
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Retourne une réponse JSON indiquant le succès ou l'échec de la mise à jour.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou de validation.
 * 
 * @description
 * Cette fonction permet de mettre à jour les informations d'un utilisateur en fonction de l'email spécifié.
 * - Si un mot de passe est fourni, il doit contenir au moins 8 caractères. Sinon, un message d'erreur est retourné.
 * - La fonction vérifie également que le mot de passe fourni correspond au mot de passe actuel de l'utilisateur.
 * - Les champs fournis dans `req.body` sont utilisés pour mettre à jour l'utilisateur.
 * - Si l'utilisateur est trouvé et mis à jour avec succès, un message de confirmation est retourné.
 * - Si l'utilisateur est introuvable ou en cas de problème serveur, un message d'erreur est renvoyé.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (profil mis à jour ou utilisateur introuvable).
 * - 500 : Erreur serveur.
 */
exports.adminUpdate = async (req, res, next) => {
    const userBody = req.body;
    const bodyPassword = req.body.password;
    const emailBody = req.body.email;

    try {
        // Vérification du mot de passe
        if (bodyPassword && bodyPassword.length < 8) {
            req.session.errorMessage = 'Le mot de passe doit contenir au moins 8 caractères.';
            return res.status(200).json({ message: 'Le mot de passe ne correspond pas aux critères.', redirectUrl: `/admin/user` });
        };

        let user = await User.findOne({ email: emailBody });

        if (user) {
            const isValid = await bcrypt.compare(bodyPassword, user.password);
            const validationPassword = { isValid: isValid, message: 'Mot de passe incorrect' }

            // Validation des champs sécurisés
            if (!validationPassword.isValid) {
                req.session.errorMessage = validationPassword.message;
                return res.status(200).json({ message: 'Mot de passe incorrect.', redirectUrl: `/admin/user` });
            }
            Object.keys(userBody).forEach((key) => {
                if (!!userBody[key]) {
                    user[key] = userBody[key];
                }
            });

            const userUpdate = await user.save();
            const email = userUpdate.email;
            req.params.email = email;

            req.session.successMessage = `Utilisateur : "${userUpdate.name}" mis à jour avec succès`;
            return res.status(200).json({ message: 'Profil mis à jour avec succès', redirectUrl: `/admin/user/${email}` });
        } else {
            req.session.errorMessage = `Utilisateur introuvable avec cet email`;
            return res.status(200).json({ message: 'Utilisateur introuvable avec cet email', redirectUrl: `/admin/user` });
        }
    } catch (error) {
        console.error("adminUpdate : erreur lors de l'utilisation de la méthode", error);
        return res.status(200).json({ message: 'Utilisateur introuvable avec cet email', redirectUrl: `/admin/user` });
    }
};

/**
 * Supprime un utilisateur en fonction de son adresse email.
 * @async
 * @function delete
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {string} req.body.email - L'adresse email de l'utilisateur à supprimer.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Retourne une réponse JSON indiquant le succès ou l'échec de la suppression.
 * @throws {Error} - Retourne une erreur en cas de problème serveur ou d'utilisateur introuvable.
 * 
 * @description
 * Cette méthode supprime un utilisateur en fonction de son adresse email.
 * - Si l'utilisateur est trouvé dans la base de données, il est supprimé et un message de succès est renvoyé.
 * - Si aucun utilisateur n'est trouvé, un message d'erreur est renvoyé.
 * - En cas de problème serveur ou d'exception, une réponse appropriée est retournée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (utilisateur supprimé ou introuvable).
 * - 501 : Erreur serveur ou problème inattendu.
 */
exports.delete = async (req, res, next) => {
    //const id = req.body._id;
    const email = req.body.email;
    try {
        const user = await User.findOne({ email: email });
        req.session.email = email;

        if (user) {
            await User.deleteOne({ email: email });
            req.session.successMessage = `Utilisateur : "${user.name}" supprimé avec succès.`;
            return res.status(200).json({ message: 'Profil supprimé avec succès', redirectUrl: `/admin/user/${email}` });
        }
        else {
            req.session.errorMessage = `Utilisateur introuvable.`;
            return res.status(200).json({ message: 'Utilisateur introuvable.', redirectUrl: `/admin/user` });
        }
    } catch (error) {
        return res.status(501).json({ message: "METHOD User:Delete = serveur introuvable", error });
    }
};
