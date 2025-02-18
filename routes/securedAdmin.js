const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');
const service = require('../services/catways');

  router.get('/menu', private.checkJWT, (req, res) => {
    res.render('adminMenu', { user: req.decoded.user });
});

  router.get('/reservation', private.checkJWT, (req, res) => {
    res.render('adminReservation', { user: req.decoded.user });
});

router.get('/user', private.checkJWT, (req, res) => {
    res.render('adminUser', { user: req.decoded.user });
});

router.get('/catways', private.checkJWT, (req, res) => {
    res.render('adminCatways', { user: req.decoded.user });
});



router.post('/catways',private.checkJWT,async (req, res, next) => {
    if(req.decoded.user) {
      try {
        await service.catwaysAdd(req, res, next);
        return res.redirect('/admin/catways');
    } catch (error) {
        return res.redirect('/catways');
    }
} else {
    res.redirect('/login'); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
}
})


  module.exports = router;