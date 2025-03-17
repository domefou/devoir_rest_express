const mongoose = require('mongoose');
//const { use } = require('../routes');

const clientOptions = {
    dbName: 'Russell'
};

/**
 * Initialise la connexion à la base de données MongoDB.
 * @function
 * @async
 * @memberof module:database
 * @throws {Error} - Retourne une erreur si la connexion à MongoDB échoue.
 * 
 * @description
 * Cette fonction établit une connexion à la base de données MongoDB en utilisant l'URL définie dans
 * la variable d'environnement `URL_MONGO` et les options spécifiées, comme le nom de la base de données (`Russell`).
 * - En cas de succès, un message de confirmation est affiché dans la console.
 * - En cas d'échec, l'erreur est loguée dans la console et rejetée.
 * 
 * @example
 * // Appel pour établir une connexion à la base de données
 * const db = require('./database');
 * db.initClientDbConnection();
 */
exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connection a database reussi');
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};