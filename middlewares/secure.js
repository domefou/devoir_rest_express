const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

/**
 * Middleware pour vérifier et renouveler le jeton JWT de l'utilisateur.
 * @function
 * @async
 * @memberof module:auth
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.cookies - Contient les cookies de la requête, y compris le jeton JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Si le jeton est valide, l'utilisateur est authentifié et le jeton est renouvelé.
 * @throws {Error} - Retourne une erreur si le jeton est invalide ou absent.
 * 
 * @description
 * Ce middleware effectue les tâches suivantes :
 * 1. Récupère le jeton JWT dans les cookies de la requête.
 * 2. Vérifie la validité du jeton :
 *    - Si valide : l'utilisateur est authentifié (`req.decoded` contient les données décodées), 
 *      et un nouveau jeton est généré avec une durée d'expiration de 24 heures et ajouté aux cookies.
 *    - Si invalide : renvoie une réponse HTTP 401 avec un message d'erreur `token_not_valid`.
 * 3. Si aucun jeton n'est fourni, redirige l'utilisateur vers la page de connexion avec un message
 *    d'erreur indiquant qu'une connexion est requise.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (jeton vérifié et renouvelé, accès autorisé).
 * - 401 : Échec d'authentification (jeton invalide).
 * - 302 : Redirection vers la page de connexion si aucun jeton n'est fourni.
 */
exports.checkJWT = async (req, res, next) => {
    let token = req.cookies.token; // Récupérer le jeton depuis les cookies

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Retirer "Bearer " du début du jeton
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log('Token non valide');
                return res.status(401).json('token_not_valid');
            } else {
                req.decoded = decoded;

                const expiresIn = 24 * 60 * 60;
                const newToken = jwt.sign({ user: decoded.user }, SECRET_KEY, { expiresIn: expiresIn });

                // Ajouter le nouveau jeton dans le cookie
                res.cookie('token', 'Bearer ' + newToken, { httpOnly: true, secure: true });
                return next();
            }
        });
    } else {
        console.log('Authentification échouée');
        return res.render('login', {
            title: 'login',
            errorMessage: '*connection requise.'
        });
    }
};


