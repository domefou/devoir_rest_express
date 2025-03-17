const express = require('express');

require('dotenv').config({ path: './env/.env' });

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

const bodyParser = require('body-parser');
//
const methodOverride = require('method-override');



//route public
const accueil = require('./routes/public/accueil');
const login = require('./routes/public/login');
const signup = require('./routes/public/signup');
//route securisé admin
const adminMenu = require('./routes/private/admin/menu');
const adminUsers = require('./routes/private/admin/users');
const adminCatways = require('./routes/private/admin/catways');
const adminReservations = require('./routes/private/admin/reservations');



//route securisé user
const userMenu = require('./routes/private/user/menu');
const userReservations = require('./routes/private/user/reservations');
//route deconnexion
const logout = require('./routes/private/logout');

const reset = require('./routes/private/reset');


// Connexion à MongoDB
const mongodb = require('./db/mongo');
mongodb.initClientDbConnection();


// Création de l'application Express
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));


//
app.use(methodOverride('_method'));

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
//
app.use(express.urlencoded({ extended: true }));





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
app.use('/', accueil, login, signup);

app.use('/admin', adminUsers, adminCatways, adminReservations, adminMenu);

app.use('/user', userMenu, userReservations);

app.use('/', logout);

app.use('/', reset);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));


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