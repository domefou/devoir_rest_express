const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Assurez-vous que le modèle User est correctement défini


router.get('/', async (req, res) =>{
    res.render('index', {
      title: 'index'
    })
  });

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

// Route POST pour le formulaire signup
router.post('/signup', async function(req, res, next) {
  try {
    var newUser = new User({
      firstname: req.body.firstname,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email
    });

    await newUser.save();
    res.redirect('/login'); // Redirigez vers la page de login après l'inscription
  } catch (err) {
    next(err);
  }
});

module.exports = router;