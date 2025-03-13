const express = require('express');
const router = express.Router();
const private = require('../../../middlewares/private');

const serviceCatways = require('../../../services/catways');
const Catways = require('../../../models/catways');



router.get('/catways', private.checkJWT, async (req, res, next) => {
  try {
      const catways = await Catways.find({});
      if (catways) {
          console.log("METHOD catwayGetById = élément trouvé");
          catways.sort((a, b) => a.catwaysNumber - b.catwaysNumber);
          const successMessage = req.session.successMessage;
          req.session.successMessage = null;

          const errorMessage = req.session.errorMessage;
          req.session.errorMessage = null;

          // Vérification de req.decoded et req.decoded.user
          if (!req.decoded || !req.decoded.user) {
              console.error('Utilisateur décodé introuvable');
              return res.status(400).send('Utilisateur décodé introuvable');
          }

          return res.render('adminCatways', {
              catways: catways,
              findCatways: null,
              user: req.decoded.user,
              errorMessage: errorMessage,
              successMessage: successMessage
          });
      }
  } catch (error) {
      return res.status(501).json({ message: "GET serveur introuvable", error });
  }
});


router.get('/catways/:catwaysNumber', private.checkJWT, async (req, res, next) => {
  const catwaysNumber = req.params.catwaysNumber;

  try {
    const catways = await Catways.find({});
    const findCatways = await Catways.findOne({ catwaysNumber: catwaysNumber });

      console.log("METHOD catwayGetById :catwaysNumber = élément trouvé");
      catways.sort((a, b) => a.catwaysNumber - b.catwaysNumber);

      const successMessage = req.session.successMessage;
      req.session.successMessage = null;

      const errorMessage = req.session.errorMessage;
      req.session.errorMessage = null;

      return res.render('adminCatways', {
        catways: catways,
        findCatways: findCatways,
        user: req.decoded.user,
        errorMessage: errorMessage,
        successMessage: successMessage

      });
  } catch (error) {
    console.log("Erreur lors du traitement de la route /admin/catways/:catwaysNumber", error);
    return res.status(501).json({ message: "GET serveur introuvable", error });
  }
});



router.post('/catways/find', private.checkJWT, async (req, res, next) => {
  //const catwaysNumber = req.body.catwaysNumber;
  //const catwaysId = req.body.catwaysId;
  const id = req.params.id;

  try {
    await Catways.findOne({ _id: id });
    const catwaysNumber = req.params.catwaysNumber;

    if (catwaysNumber) {
      await serviceCatways.CatwaysUpdate(req, res);
    } else {
      req.params.catwaysNumber = catwaysNumber;
      await serviceCatways.catwaysGetById(req, res);
    }
  } catch (error) {
    if (!res.headersSent) {
      return res.status(501).json({ message: "POST/PUT serveur introuvable", error });
    }
  }
});





//route post pour formulaire supprimer

router.post('/catways/delete', private.checkJWT, async (req, res, next) => {
  //const id = req.params.id;
  //const id = req.body.catwaysId;

  try {
      await serviceCatways.catwaysDelete(req, res);
  } catch (error) {
      if (!res.headersSent) {
        return res.status(501).json({ message: "POST/DELETE serveur introuvable" , error });
      }
  }
});



//route delete pour supprimer
/*
router.delete('/catways/delete',private.checkJWT, async (req, res) => {
  try{
    await serviceCatways.catwaysDelete(req,res,next);

  } catch(error){
    return res.status(501).json({ message: "DELETE serveur introuvable" , error });
  }

});
*/
//route patch pour modifier le contenu 


/*

router.put('/catways/put',private.checkJWT, async (req, res) => {
    await serviceCatways.CatwaysUpdate(req,res);

});

router.post('/catways/add', private.checkJWT, async (req, res) => {
    await serviceCatways.catwaysAdd(req,res);
});
*/

router.post('/catways/add', private.checkJWT, async (req, res, next) => {
  
  const catwaysNumber = req.body.catwaysNumber;
  const catways = await Catways.findOne({catwaysNumber: catwaysNumber});
  const id = req.body._id
    console.log(catways);

  try {
    if(id){
      await serviceCatways.CatwaysUpdate(req,res);
    }
    else{
      await serviceCatways.catwaysAdd(req,res);
    }
    
  } catch (error) {
      if (!res.headersSent) {
          return res.status(501).json({ message: "POST/PUT serveur introuvable" , error });
      }
  }
});

module.exports = router;