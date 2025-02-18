const express = require('express');
const router = express.Router();
const private = require('../middlewares/private');


  router.get('/menu', private.checkJWT, (req, res) => {
    res.render('menu', { user: req.decoded.user });
});

  router.get('/reservation', private.checkJWT, (req, res) => {
    res.render('reservation', { user: req.decoded.user });
});

  module.exports = router;