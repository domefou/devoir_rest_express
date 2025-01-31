const express = require('express');

require('dotenv').config({ path: './env/.env' });


//path est un module qui fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires.
const path = require('path');

//cookie-parser est un middleware qui permet de parser les cookies d'une requête HTTP.
const cookieParser = require('cookie-parser');

//morgan est un middleware qui permet de logger les requêtes HTTP.
const logger = require('morgan');

// cors est un middleware qui permet de gérer les requêtes HTTP cross-origin.
const cors = require('cors');



//Les routes sont des fonctions qui prennent en charge les requêtes client et les réponses en fonction de l'URL demandée et de la méthode HTTP utilisée.

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const adminusersRouter = require('./routes/adminusers')
const usersRouter = require('./routes/users');


//mongodb est un module qui permet de se connecter à une base de données MongoDB.
const mongodb = require('./db/mongo');

mongodb.initClientDbConnection();


//app utilise express pour créer une application.
const app = express();


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')



app.use(cors({
    exposedHeaders : ['Authorization'],
    origin: '*'
    }));

// app.use() est une méthode qui permet d'ajouter des middlewares à l'application.
//logger('dev') est un middleware qui permet de logger les requêtes HTTP.
app.use(logger('dev'));
//express.json() est un middleware qui permet de parser les requêtes HTTP en JSON.
app.use(express.json());
//express.urlencoded() est un middleware qui permet de parser les requêtes HTTP en URL-encoded.
app.use(express.urlencoded({ extended: false }));
//cookieParser() est un middleware qui permet de parser les cookies d'une requête HTTP.
app.use(cookieParser());
//express.static() est un middleware qui permet de servir des fichiers statiques.

/*
app.use(express.static(path.join(__dirname, 'public')));
*/

//app.use() est une méthode qui permet d'ajouter des middlewares à l'application.
app.use('/', indexRouter)
app.use('/', loginRouter);
app.use('/', signupRouter);
app.use('/', adminusersRouter);
app.use('/', usersRouter);


app.use((req, res, next) => {
    res.status(404).json({name:'API', version:'1.0', status:404, message:'Not Found'});
});

module.exports = app;


//mongodb
// username:domefoufou
// password:4REOcZrXfhZw3T1x


/*
Admin
Admin404
*/