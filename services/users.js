const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const { SECRET_KEY } = process.env;

exports.authenticate = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email }, '-__v -createdAt -updatedAt');

        if (user) {
            const isMatch = bcrypt.compare(password, user.password);

            if (isMatch) {
                delete user._doc.password;

                const expireIn = 24 * 60 * 60;
                const token = jwt.sign({
                    user: user
                }, SECRET_KEY, {
                    expiresIn: expireIn
                });

                // Ajout d'un espace après 'Bearer'
                res.cookie('token', 'Bearer ' + token, { httpOnly: true, secure: true });

                req.decoded = { user: user }; // Ajout du décodage de l'utilisateur pour l'utiliser après
                return next();
            } else {
                res.status(401).json({ message:'mise en token échouée'});
                return res.render('login', { 
                    title: 'login', 
                    errorMessage: '*email ou mot de passe incorrect.' 
                });
            }
        } else {
            console.log('Utilisateur introuvable');
            return res.render('login', { 
                title: 'login', 
                errorMessage: 'Utilisateur introuvable.' 
            });
        }
    }catch (error) {
        console.error('Erreur lors de l\'authentification :', error);
        return res.status(501).json({ message: "Erreur du serveur interne", erreur: error });
    }};

   
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
    let {name, firstname, email, password, question, response} = req.body;

    let role;
    if (email === "admin@mail.com") {
        role = "admin";
    } else {
        role = "user";
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedResponse = await bcrypt.hash(response, 10);
        
    const temp = {
        name: name,
        firstname: firstname,
        email: email,
        password: hashedPassword,
        role: role,
        question: question,
        response: hashedResponse
    };

        let user = await User.create(temp);
        console.log('Utilisateur créé avec succès:', user);
        req.user = user; // Stocker l'utilisateur dans req pour une utilisation ultérieure
        return next(); // Passer au middleware suivant
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        return res.status(500).json(error);
    }};
    

   

//on crée une fonction qui va modifier un utilisateur

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

exports.passwordUpdate = async (req, res, next) => {
    const question = req.body.question;
    const response = req.body.response;
    const newPassword = req.body.password;
    const email = req.body.email;

    try {
        
        let user = await User.findOne({email: email}, '-__v -updatedAt');
        
        if (!user) {
            console.log('Utilisateur introuvable');
            return res.status(404).json({ message: 'Utilisateur introuvable' });
        }
        if(question === user.question && response === user.response){

        // Mettre à jour le mot de passe
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        console.log('Mot de passe mis à jour avec succès pour l\'utilisateur :');
        return next();
    }} catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe :', error);
        return res.status(500).json({ message: 'Erreur du serveur interne', erreur: error });
    }
};

    
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



