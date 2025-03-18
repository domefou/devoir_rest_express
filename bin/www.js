#!/usr/bin/env node

/**
 * Importation des modules nécessaires
 */
const app = require('../app.js'); // L'application Express
const debug = require('debug')('api:server'); // Débogage
const http = require('http'); // Serveur HTTP

/**
 * Configuration du port
 * - Utilise le port de l'environnement ou 3000 par défaut
 */
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/**
 * Création du serveur HTTP
 */
const server = http.createServer(app);

/**
 * Démarrage du serveur et gestion des événements
 */
server.listen(port);
server.on('error', onError); // Gestion des erreurs
server.on('listening', onListening); // Confirmation de l'écoute

/**
 * Normalisation du port
 * - Transforme une valeur de port en un nombre, une chaîne ou "false"
 * @param {string|number} val - Le port à normaliser
 * @returns {number|string|boolean} - Port normalisé ou "false"
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // Si ce n'est pas un nombre, retournez la valeur brute (pipe nommée)
    return val;
  }

  if (port >= 0) {
    // Si c'est un numéro de port valide, retournez-le
    return port;
  }

  return false;
}

/**
 * Gestionnaire d'événements en cas d'erreur du serveur
 * @param {Object} error - L'objet d'erreur capturé
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port // Dans le cas d'une pipe nommée
    : 'Port ' + port; // Dans le cas d'un numéro de port

  // Gestion des erreurs spécifiques
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} nécessite des privilèges élevés.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} est déjà utilisé.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Gestionnaire d'événements lorsque le serveur commence à écouter
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'Pipe ' + addr
    : 'Port ' + addr.port;
  debug(`Écoute sur ${bind}`);
}

/**
 * Exportation du serveur HTTP
 */
module.exports = server;


