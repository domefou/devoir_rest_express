const express = require('express');
const router = express.Router();
const secure = require('../../../middlewares/secure');

const service = require('../../../services/users');
const Users = require('../../../models/users');

/**
 * Route GET pour afficher la liste des utilisateurs ou rediriger vers un utilisateur spécifique.
 * @function
 * @async
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.params - Les paramètres de l'URL.
 * @param {string} req.params.email - Adresse email de l'utilisateur à rechercher.
 * @param {Object} req.session - L'objet session pour gérer les messages de succès et d'erreur.
 * @param {Object} req.decoded - L'utilisateur décodé après validation du token JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Rend la page `adminUser` avec les informations des utilisateurs ou redirige vers un utilisateur spécifique.
 * @throws {Error} - Retourne une erreur en cas de problème serveur.
 * 
 * @description
 * Cette route récupère les informations des utilisateurs et permet de rendre la page d'administration des utilisateurs ou de rediriger vers un utilisateur spécifique.
 * - Si un utilisateur correspondant à l'email dans `req.params.email` est trouvé, redirige vers la page dédiée à cet utilisateur.
 * - Sinon, rend la page `adminUser` avec la liste complète des utilisateurs et les messages de session (succès/erreur).
 * - Réinitialise les messages de session après le rendu ou la redirection.
 * - Fournit également la date actuelle formatée (AAAA-MM-JJ) pour l'affichage.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (page rendue ou redirection effectuée).
 * - 501 : Erreur serveur.
 */
router.get('/user', secure.checkJWT, async (req, res) => {
  try {
    const { email } = req.params;
    const findUsers = await Users.findOne({ email: email })

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const users = await Users.find({});
    const successMessage = req.session.successMessage;
    req.session.successMessage = null;

    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;
    if (findUsers) {
      return res.redirect('admin/user/:email')
    } else {
      return res.render('adminUser', {
        users: users,
        findUsers: findUsers || null,
        formattedDate: formattedDate,
        user: req.decoded.user,
        successMessage: successMessage || null,
        errorMessage: errorMessage || null
      });

    }


  } catch (error) {
    return res.status(501).json({ message: "GET serveur introuvable", error });
  }
});



/**
 * Route GET pour afficher les informations d'un utilisateur spécifique et la liste complète des utilisateurs.
 * @function
 * @async
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.params - Les paramètres de l'URL.
 * @param {string} req.params.email - L'adresse email de l'utilisateur à rechercher.
 * @param {Object} req.session - L'objet session pour gérer les messages de succès et d'erreur.
 * @param {Object} req.decoded - L'utilisateur décodé après validation du token JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Rend la page `adminUser` avec les informations de l'utilisateur ou un message d'erreur.
 * @throws {Error} - Retourne une erreur en cas de problème serveur.
 * 
 * @description
 * Cette route permet d'afficher les détails d'un utilisateur spécifique basé sur son adresse email, ainsi que la liste complète des utilisateurs.
 * - Les informations de session (messages de succès et d'erreur) sont récupérées et réinitialisées après usage.
 * - Si un utilisateur correspondant à l'email est trouvé, ses détails sont inclus dans la vue rendue.
 * - La date actuelle est formatée au format ISO (AAAA-MM-JJ) et incluse dans le rendu pour l'affichage.
 * - Les messages de session, la liste des utilisateurs et les détails de l'utilisateur spécifique (le cas échéant) sont envoyés à la vue.
 * - En cas d'erreur lors de la recherche ou de problèmes serveur, une réponse JSON avec un statut HTTP 501 est renvoyée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (page rendue avec les informations des utilisateurs).
 * - 501 : Erreur serveur.
 */
router.get('/user/:email', secure.checkJWT, async (req, res) => {
  const { email } = req.params;
  try {
    const users = await Users.find({});
    const findUsers = await Users.findOne({ email: email })

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const successMessage = req.session.successMessage;
    req.session.successMessage = null;

    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;


    res.render('adminUser', {
      users: users,
      findUsers: findUsers || null,
      formattedDate, formattedDate,
      user: req.decoded.user,
      successMessage: successMessage || null,
      errorMessage: errorMessage || null
    });

  } catch (error) {
    return res.status(501).json({ message: "GET serveur introuvable", error });
  }
});


/**
 * Route POST pour rechercher un utilisateur spécifique.
 * @function
 * @async
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Exécute le service `getById` pour effectuer la recherche.
 * @throws {Error} - Retourne une erreur si le service ou le serveur échoue.
 * 
 * @description
 * Cette route utilise le service `getById` pour rechercher les informations d'un utilisateur
 * spécifique en fonction des données fournies dans la requête.
 * - Protégée par le middleware JWT pour authentifier et autoriser l'utilisateur.
 * - En cas d'erreur, une réponse JSON avec un statut HTTP 501 est retournée.
 */
router.post('/user/find', secure.checkJWT, async (req, res, next) => {
  try {
    await service.getById(req, res);

  } catch (error) {
    return res.status(501).json({ message: "METHOD POST user/find serveur introuvable", error });
  }
});


/**
 * Route DELETE pour supprimer un utilisateur spécifique.
 * @function
 * @async
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Exécute le service `delete` pour supprimer l'utilisateur.
 * @throws {Error} - Retourne une erreur si le service ou le serveur échoue.
 * 
 * @description
 * Cette route appelle le service `delete` pour supprimer un utilisateur de la base de données.
 * - Protégée par le middleware JWT pour authentifier et autoriser l'utilisateur.
 * - Si une erreur se produit, une réponse JSON avec un statut HTTP 501 est retournée.
 */
router.delete('/user/delete', secure.checkJWT, async (req, res) => {
  try {
    await service.delete(req, res);

  } catch (error) {
    return res.status(501).json({ message: "METHOD DELETE user/delete serveur introuvable", error });
  }

});



/**
 * Route POST pour ajouter un nouvel utilisateur.
 * @function
 * @async
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Exécute le service `adminAdd` pour créer un nouvel utilisateur.
 * @throws {Error} - Retourne une erreur si le service ou le serveur échoue.
 * 
 * @description
 * Cette route utilise le service `adminAdd` pour ajouter un nouvel utilisateur à la base de données.
 * - Protégée par le middleware JWT pour authentifier et autoriser l'utilisateur.
 * - En cas d'erreur, une réponse JSON avec un statut HTTP 501 est retournée.
 */
router.post('/user/add', secure.checkJWT, async (req, res, next) => {
  try {
    await service.adminAdd(req, res);

  } catch (error) {
    return res.status(501).json({ message: "ROUTE POST user/add serveur introuvable", error });
  }
});

/**
 * Route PUT pour mettre à jour les informations d'un utilisateur.
 * @function
 * @async
 * @memberof module:users
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Exécute le service `adminUpdate` pour modifier les informations d'un utilisateur.
 * @throws {Error} - Retourne une erreur si le service ou le serveur échoue.
 * 
 * @description
 * Cette route appelle le service `adminUpdate` pour mettre à jour les informations d'un utilisateur.
 * - Protégée par le middleware JWT pour authentifier et autoriser l'utilisateur.
 * - En cas d'erreur, une réponse JSON avec un statut HTTP 501 est retournée.
 */
router.put('/user/put', secure.checkJWT, async (req, res, next) => {
  try {
    await service.adminUpdate(req, res);

  } catch (error) {
    return res.status(501).json({ message: "ROUTE PUT user/put serveur introuvable", error });
  }

});

module.exports = router;