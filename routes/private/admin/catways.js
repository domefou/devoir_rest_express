const express = require('express');
const router = express.Router();
const secure = require('../../../middlewares/secure');

const serviceCatways = require('../../../services/catways');
const Catways = require('../../../models/catways');


/**
 * Route GET pour afficher les informations des catways.
 * @function
 * @async
 * @memberof module:catways
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.params - Les paramètres de l'URL.
 * @param {string} [req.params.catwaysNumber] - Numéro du catway à rechercher (optionnel).
 * @param {Object} req.session - Objet session pour récupérer les messages de succès et d'erreur.
 * @param {Object} req.decoded - Objet utilisateur décodé après validation du token JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Rend la page `adminCatways` avec les données des catways ou renvoie une erreur.
 * @throws {Error} - Retourne une erreur si le serveur ou une opération échoue.
 * 
 * @description
 * Cette route permet d'afficher tous les catways disponibles ainsi qu'un catway spécifique si son numéro est fourni.
 * - Vérifie que l'utilisateur décodé est valide avant de continuer.
 * - Trie les catways récupérés par leur numéro.
 * - Si un `catwaysNumber` est fourni et correspond à un catway existant, les détails de ce catway sont affichés.
 * - En cas de succès, la page `adminCatways` est rendue avec les catways, les messages de session et la date actuelle.
 * - Gère les erreurs serveur et les cas où un utilisateur décodé est introuvable.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (rend la page `adminCatways`).
 * - 400 : Erreur (utilisateur décodé introuvable).
 * - 501 : Erreur serveur.
 */
router.get('/catways', secure.checkJWT, async (req, res, next) => {

  try {
    if (!req.decoded || !req.decoded.user) {
      console.error('Utilisateur décodé introuvable');
      return res.status(400).send('Utilisateur décodé introuvable');
    }
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const catwaysNumber = req.params.catwaysNumber;

    const successMessage = req.session.successMessage;
    req.session.successMessage = null;

    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;

    const catways = await Catways.find({});
    if (catways) {
      catways.sort((a, b) => a.catwaysNumber - b.catwaysNumber);



      const findCatways = await Catways.findOne({ catwaysNumber: catwaysNumber });
      if (findCatways) {
        return res.render('adminCatways', {
          catways: catways,
          findCatways: findCatways,
          formattedDate: formattedDate,
          user: req.decoded.user,
          errorMessage: errorMessage,
          successMessage: successMessage
        });
      }


      return res.render('adminCatways', {
        catways: catways,
        findCatways: null,
        formattedDate: formattedDate,
        user: req.decoded.user,
        errorMessage: errorMessage,
        successMessage: successMessage
      });
    }
  } catch (error) {
    return res.status(501).json({ message: "GET serveur introuvable", error });
  }
});


/**
 * Route GET pour afficher les informations d'un catway spécifique et de tous les catways.
 * @function
 * @async
 * @memberof module:catways
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.params - Les paramètres de l'URL.
 * @param {string} req.params.catwaysNumber - Numéro du catway à rechercher.
 * @param {Object} req.session - Objet session pour récupérer les messages de succès et d'erreur.
 * @param {Object} req.decoded - Objet utilisateur décodé après validation du token JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Rend la page `adminCatways` avec les informations des catways ou renvoie une erreur.
 * @throws {Error} - Retourne une erreur en cas d'échec de validation ou de problème serveur.
 * 
 * @description
 * Cette route permet d'afficher les informations de tous les catways disponibles et d'un catway spécifique
 * identifié par son `catwaysNumber`. 
 * - Trie la liste des catways récupérés par leur numéro.
 * - Si le `catwaysNumber` n'est pas un nombre valide, un message d'erreur JSON est renvoyé.
 * - Si un catway correspondant est trouvé, ses détails sont rendus dans la page `adminCatways`.
 * - Si aucun catway correspondant n'est trouvé, la page est rendue avec la liste des catways et sans
 * détails spécifiques.
 * - Gère également les erreurs serveur ou les cas où les messages de session doivent être affichés.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (page rendue avec ou sans détails d'un catway spécifique).
 * - 400 : Erreur (le `catwaysNumber` fourni n'est pas un nombre valide).
 * - 501 : Erreur serveur ou problème inattendu.
 */
router.get('/catways/:catwaysNumber', secure.checkJWT, async (req, res, next) => {

  try {
    const successMessage = req.session.successMessage;
    req.session.successMessage = null;

    const errorMessage = req.session.errorMessage;
    req.session.errorMessage = null;

    const catways = await Catways.find({});
    if (catways) {
      catways.sort((a, b) => a.catwaysNumber - b.catwaysNumber);

      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];


      const catwaysNumber = Number(req.params.catwaysNumber);
      if (isNaN(catwaysNumber)) {
        return res.status(400).json({ message: 'Le numéro de catways doit être un nombre.' })
      }

      const findCatways = await Catways.findOne({ catwaysNumber: catwaysNumber });

      if (findCatways) {
        return res.render('adminCatways', {
          catways: catways,
          findCatways: findCatways,
          formattedDate: formattedDate,
          user: req.decoded.user,
          errorMessage: errorMessage,
          successMessage: successMessage
        });
      } else {
        return res.render('adminCatways', {
          catways: catways,
          findCatways: null,
          formattedDate: formattedDate,
          user: req.decoded.user,
          errorMessage: errorMessage,
          successMessage: successMessage
        });
      }
    }
  } catch (error) {
    console.log("Erreur lors du traitement de la route /admin/catways/:catwaysNumber", error);
    return res.status(501).json({ message: "GET serveur introuvable", error });
  }
});


/**
 * Route POST pour rechercher un catway spécifique par des critères donnés.
 * @function
 * @async
 * @memberof module:catways
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} req.body - Les données envoyées dans la requête.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {function} next - La fonction middleware suivante.
 * @returns {Promise<void>} - Exécute la recherche via un service et renvoie une réponse JSON en cas d'erreur.
 * @throws {Error} - Retourne une erreur si le serveur ou le service échoue.
 * 
 * @description
 * Cette route utilise le service `serviceCatways.catwaysGetById` pour effectuer une recherche de catway.
 * - Protégée par un middleware JWT pour authentifier l'utilisateur.
 * - Si une erreur est levée et que les en-têtes de réponse ne sont pas encore envoyés, une réponse avec le statut 501 et un message d'erreur est retournée.
 * - En cas de succès, la logique de traitement et de réponse est gérée par le service appelé.
 * 
 * Exemples de statut HTTP :
 * - 501 : Erreur serveur ou problème inattendu.
 */
router.post('/catways/find', secure.checkJWT, async (req, res, next) => {
  try {
    await serviceCatways.catwaysGetById(req, res);
  }
  catch (error) {
    if (!res.headersSent) {
      return res.status(501).json({ message: "POST find serveur introuvable", error });
    }
  }
});

/**
 * Route DELETE pour supprimer un catway spécifique.
 * @function
 * @async
 * @memberof module:catways
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Retourne une réponse JSON indiquant le succès ou l'échec de la suppression.
 * @throws {Error} - Retourne une erreur si le serveur ou le service échoue.
 * 
 * @description
 * Cette route appelle le service `serviceCatways.delete` pour supprimer un catway de la base de données.
 * - Protégée par un middleware JWT pour authentifier et autoriser l'utilisateur.
 * - En cas de succès, la logique et le retour sont gérés par le service appelé.
 * - En cas d'échec, une réponse avec un message d'erreur et un statut HTTP 501 est retournée.
 * - La réponse est conditionnée à ce que les en-têtes HTTP n'aient pas déjà été envoyés.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (le catway a été supprimé avec succès par le service).
 * - 501 : Erreur serveur ou problème inattendu.
 */
router.delete('/catways/delete', secure.checkJWT, async (req, res) => {
  try {
    await serviceCatways.delete(req, res);

  } catch (error) {
    return res.status(501).json({ message: "DELETE serveur introuvable", error });
  }

});

/**
 * Route PUT pour mettre à jour les informations d'un catway.
 * @function
 * @async
 * @memberof module:catways
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Retourne une réponse JSON indiquant le succès ou l'échec de la mise à jour.
 * @throws {Error} - Retourne une erreur en cas d'échec du service ou de problème serveur.
 * 
 * @description
 * Cette route appelle le service `serviceCatways.CatwaysUpdate` pour mettre à jour un catway spécifique.
 * - Protégée par un middleware JWT pour authentifier et autoriser l'utilisateur.
 * - La logique de mise à jour et la gestion des réponses sont entièrement gérées par le service appelé.
 * - En cas de problème serveur ou d'échec de la mise à jour, une erreur est levée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (catway mis à jour avec succès par le service).
 * - 501 : Erreur serveur ou problème inattendu.
 */
router.put('/catways/put', secure.checkJWT, async (req, res) => {
  await serviceCatways.CatwaysUpdate(req, res);

});


/**
 * Route POST pour ajouter un nouveau catway.
 * @function
 * @async
 * @memberof module:catways
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express.
 * @returns {Promise<void>} - Retourne une réponse JSON indiquant le succès ou l'échec de l'ajout.
 * @throws {Error} - Retourne une erreur en cas d'échec du service ou de problème serveur.
 * 
 * @description
 * Cette route appelle le service `serviceCatways.catwaysAdd` pour ajouter un nouveau catway dans la base de données.
 * - Protégée par un middleware JWT pour authentifier et autoriser l'utilisateur.
 * - La logique de création et la gestion des réponses sont entièrement gérées par le service appelé.
 * - En cas de problème serveur ou d'échec de l'ajout, une erreur est levée.
 * 
 * Exemples de statut HTTP :
 * - 200 : Succès (catway ajouté avec succès par le service).
 * - 501 : Erreur serveur ou problème inattendu.
 */
router.post('/catways/add', secure.checkJWT, async (req, res) => {
  await serviceCatways.catwaysAdd(req, res);
});


module.exports = router;