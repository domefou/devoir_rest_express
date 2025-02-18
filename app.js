const express = require('express');

require('dotenv').config({ path: './env/.env' });

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

//route public
const publicRoutes = require('./routes/publicRoutes');
//route securisé admin
const securedAdmin = require('./routes/securedAdmin');
//route securisé user
const securedUser = require('./routes/securedUser');
//route deconnexion
const logout = require('./routes/logout');

const reset = require('./routes/reset');


// Connexion à MongoDB
const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();

// Création de l'application Express
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'votreSecretDeSession',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Utilisez `true` en production avec HTTPS
}));




app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));



const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
};

// Utiliser le middleware avant les routes sécurisées
app.use(nocache);

app.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}));

// Utilisation des routes
app.use('/', publicRoutes );

app.use('/admin', securedAdmin);

app.use('/user', securedUser);

app.use('/', logout);

app.use('/', reset);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.status(404).json({ name: 'API', version: '1.0', status: 404, message: 'Not Found' });
});

module.exports = app;


/*
admin 
admin
admin@mail.com
admin0000

user
user
user@mail.com
user0000
*/