const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

exports.checkJWT = async (req, res, next) => {
    let token = req.cookies.token; // Récupérer le jeton depuis les cookies

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Retirer "Bearer " du début du jeton
    }

    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
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
}

/*
exports.checkJWT = async (req, res, next) => {
    //let token = req.headers['x-access-token'] || req.headers['authorization'];
    let token = req.cookies.token; // Récupérer le jeton depuis les cookies

    if (!!token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (token) {


        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json('token_not_valid');
            } else {
                req.decoded = decoded;

                const expiresIn = 24 * 60 * 60;
                const newToken = jwt.sign({
                    user: decoded.user
                },
                    SECRET_KEY,
                    {
                        expiresIn: expiresIn
                    });

                // Ajout d'un espace après 'Bearer'
                //res.header('Authorization', 'Bearer ' + newToken);
                res.cookie('token', 'Bearer ' + newToken, { httpOnly: true, secure: true });
                return next();
            }
        });
    } else {
        //return res.status(401).json('token_required');
        console.log('Authentification echouée');
        return res.render('login', { 
            title: 'login', 
            errorMessage: '*connection requise.' 
        });
    }
}
*/

