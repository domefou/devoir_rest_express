const express = require('express');
const router = express.Router();
const service = require('../../services/users');

router.get('/', async (req, res) => {
  if (req.cookies.token) { // Vérifiez si un jeton JWT est présent
    console.log('Jeton présent, suppression du jeton.'); // Ajout de journaux
    res.clearCookie('token'); // Supprimez le jeton JWT
    console.log('Jeton supprimé.'); // Ajout de journaux
  }
  res.render('index', {
    title: 'index'
  });
});

module.exports = router;