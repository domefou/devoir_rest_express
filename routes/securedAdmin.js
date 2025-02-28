const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const service = require('../services/catways');
const Catways = require('../models/catways');
const User = require('../models/users');

  router.get('/menu', private.checkJWT, (req, res) => {
    res.render('adminMenu', { user: req.decoded.user });
});

  router.get('/reservation', private.checkJWT, (req, res) => {
    res.render('adminReservation', { user: req.decoded.user });
});

router.get('/user', private.checkJWT, (req, res) => {
    res.render('adminUser', { user: req.decoded.user });
});


 /////////////////////// CATWAY /////////////////////////
 

router.get('/catways', private.checkJWT, async (req, res) => {
  try {
    const catways = await Catways.find({});
    res.render('adminCatways', { 
      catways: catways,
      user: req.decoded.user,
      errorMessage: null  });
    
} catch (error) {
  return res.status(501).json({ message: "GET serveur introuvable" , error });
}
});


//route post pour formulaire supprimer

router.post('/catways/delete', private.checkJWT, async (req, res, next) => {
  const id = req.body.catwaysId;

  try {
      await service.catwaysDelete({ params: { id } }, res);
      return res.redirect('/admin/catways');
  } catch (error) {
      if (!res.headersSent) {
        return res.status(501).json({ message: "POST/DELETE serveur introuvable" , error });
      }
  }
});

//route delete pour supprimer
router.delete('/catways',private.checkJWT, async (req, res) => {
  const identifiant = req.body.catwaysId;
  const id = req.params.id;
  try{
    await Catways.findById(id);
      if(identifiant === id) service.catwaysDelete(req,res);
        res.redirect('/catway');

  } catch(error){
    return res.status(501).json({ message: "DELETE serveur introuvable" , error });
  }

})

//route patch pour modifier le contenu 


router.put('/catways',private.checkJWT, async (req, res) => {
  
  const id = req.params.id;
  try{
     await Catways.findOne({_id : id});
      if(id) service.CatwaysUpdate(req,res);
      res.redirect('/admin/catways');
  } catch(error){
      return res.status(501).json({ message: "PUT serveur introuvable" , error });
  }

})



router.post('/catways', private.checkJWT, async (req, res, next) => {
  const catwaysId = req.body.catwaysId;
  const id = req.params.id;

  try {
      await Catways.findOne({_id : id});
    if(catwaysId){
      await service.CatwaysUpdate(req,res);
      return res.redirect('/admin/catways');
    }else{
      await service.catwaysAdd(req,res);
      return res.redirect('/admin/catways');
    }
    
  } catch (error) {
      if (!res.headersSent) {
          return res.status(501).json({ message: "POST/PUT serveur introuvable" , error });
      }
  }
});








/*

// route post pour modifier un profil

router.post('/catways', private.checkJWT, async (req, res, next) => {
  const id = req.body.catwaysId;

  try {
    await service.CatwaysUpdate(req,res);
      return res.redirect('/admin/catways');
  } catch (error) {
      if (!res.headersSent) {
          return res.status(501).json({ message: "POST/PUT serveur introuvable" , error });
      }
  }
});




//route post pour formulaire ajout de catway
router.post('/catways', private.checkJWT, async (req, res, next) => {
  const id = req.body.catwaysId;

  try {
    await service.catwaysAdd(req,res);
      return res.redirect('/admin/catways');
  } catch (error) {
      if (!res.headersSent) {
        return res.status(501).json({ message: "POST/ADD serveur introuvable" , error });
      }
  }
});
*/






  module.exports = router;