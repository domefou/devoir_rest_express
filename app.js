// Charger les variables d'environnement dès le début
require('dotenv').config({ path: './env/.env' });

// Importation des modules principaux
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

// Création de l'application Express
const app = express();

// Initialisation de MongoDB
const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

// Configuration de MongoDB Store pour les sessions
const store = new MongoDBStore({
    uri: process.env.URL_MONGO, // URL de connexion MongoDB
    collection: 'mySessions'   // Nom de la collection pour les sessions
});
store.on('error', (error) => {
    console.error('Erreur MongoDB Store :', error);
});

// Middleware pour les sessions
app.use(session({
    secret: process.env.SECRET_KEY, // Assurez-vous que cette variable est définie dans env/.env
    resave: false,
    saveUninitialized: true,
    store: store
}));

// Middlewares globaux
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Configuration des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware pour le contrôle du cache
const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};
app.use(nocache);

// Middleware pour ajouter l'utilisateur aux locaux de réponse si la session existe
app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

// CORS (Cross-Origin Resource Sharing)
app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

// Déclaration des routes
// Routes publiques
const accueil = require('./routes/public/accueil');
const login = require('./routes/public/login');
const signup = require('./routes/public/signup');

// Routes sécurisées admin
const adminMenu = require('./routes/private/admin/menu');
const adminUsers = require('./routes/private/admin/users');
const adminCatways = require('./routes/private/admin/catways');
const adminReservations = require('./routes/private/admin/reservations');

// Routes sécurisées user
const userMenu = require('./routes/private/user/menu');
const userReservations = require('./routes/private/user/reservations');

// Autres routes
const logout = require('./routes/private/logout');
const reset = require('./routes/private/reset');

// Utilisation des routes
app.use('/', accueil, login, signup);
app.use('/admin', adminUsers, adminCatways, adminReservations, adminMenu);
app.use('/user', userMenu, userReservations);
app.use('/', logout);
app.use('/', reset);

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));

// Gestion des erreurs 404
app.use((req, res, next) => {
    res.status(404).json({ name: 'API', version: '1.0', status: 404, message: 'Not Found' });
});

// Middleware de gestion des erreurs 500 (optionnel)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ name: 'API', version: '1.0', status: 500, message: 'Internal Server Error' });
});

// Exportation de l'application
module.exports = app;

