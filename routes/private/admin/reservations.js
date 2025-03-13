const express = require('express');
const router = express.Router();
const Reservations = require('../../../models/reservation')
const private = require('../../../middlewares/private');
const service = require('../../../services/reservation');


router.get('/reservations', private.checkJWT, async (req, res, next) => {
   try {
            const reservations = await Reservations.find({});
            if (reservations) {
                console.log("METHOD reservation GetById = élément trouvé");
  
                reservations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  
                const successMessage = req.session.successMessage;
                req.session.successMessage = null;
      
                const errorMessage = req.session.errorMessage;
                req.session.errorMessage = null;
      
                // Vérification de req.decoded et req.decoded.user
                if (!req.decoded || !req.decoded.user) {
                    console.error('Utilisateur décodé introuvable');
                    return res.status(400).send('Utilisateur décodé introuvable');
                }
      
                  reservations.forEach(reservation => {
                  reservation.startDate = new Date(reservation.startDate).toISOString().split('T')[0];
                  reservation.endDate = new Date(reservation.endDate).toISOString().split('T')[0];
              });
              
                return res.render('adminReservations', {
                    reservations: reservations,
                    findReservations: null,
                    user: req.decoded.user,
                    errorMessage: errorMessage,
                    successMessage: successMessage
                });
            }
        } catch (error) {
            return res.status(501).json({ message: "GET reservation : serveur introuvable", error });
        }
});


router.get('/reservations/:catwaysNumber', private.checkJWT, async (req, res, next) => {
   
   
       try {
        const catwaysNumber = Number(req.params.catwaysNumber);
        if (isNaN(catwaysNumber)) {
            return res.status(400).json({ message: 'Le numéro de catways doit être un nombre.' });
        }
   
           const reservations = await Reservations.find({});
           
               reservations.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
           
               const successMessage = req.session.successMessage;
               req.session.successMessage = null;
           
               const errorMessage = req.session.errorMessage;
               req.session.errorMessage = null;
           
               reservations.forEach(reservation => {
               reservation.startDate = new Date(reservation.startDate).toISOString().split('T')[0];
               reservation.endDate = new Date(reservation.endDate).toISOString().split('T')[0];
               });
               
           // Recherche de toutes les réservations correspondant à catwaysNumber
           const findReservations = await Reservations.find({ catwaysNumber: catwaysNumber });
   
               // Passez les réservations trouvées à la vue pour les afficher
               return res.render('adminReservations', {
                   reservations: reservations,
                   findReservations: findReservations,
                   user: req.decoded.user,
                   errorMessage: errorMessage,
                   successMessage: successMessage
               });
   
       } catch (error) {
           console.error('ROUTE GET : catwaysNumber Erreur lors de la recherche des réservations :', error);
           return res.status(500).json({ message: "Erreur serveur lors de la recherche.", error });
       }});



router.post('/reservations/find', private.checkJWT, async (req, res, next) => {
    
    try {
        await service.getById(req, res);
    } catch (error) {
        return res.status(501).json({ message: "POST/FIND serveur introuvable" , error });
    }
});





//route post pour formulaire supprimer
/*
router.post('/reservations/delete', private.checkJWT, async (req, res, next) => {
  //const id = req.params.id;
  //const id = req.body.catwaysId;

  try {
      await service.delete(req, res);
  } catch (error) {
      if (!res.headersSent) {
        return res.status(501).json({ message: "POST/DELETE serveur introuvable" , error });
      }
  }
});
*/

router.delete('/reservations/delete', private.checkJWT, async (req, res, next) => {
    //const id = req.params.id;
    //const id = req.body.catwaysId;
  
    try {
        await service.delete(req, res);
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




router.put('/reservations/put',private.checkJWT, async (req, res) => {
    await service.update(req,res);
});




router.post('/reservations/add', private.checkJWT, async (req, res, next) => {
    await service.add(req, res);
});





module.exports = router;