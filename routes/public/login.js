const express = require('express');
const router = express.Router();
const service = require ('../../services/users');

router.get('/login', async (req, res) => {
    if (req.cookies.token) {
      // Vérifiez si un jeton JWT est présent
        console.log('Jeton présent, suppression du jeton.'); // Ajout de journaux
        res.clearCookie('token'); // Supprimez le jeton JWT
        console.log('Jeton supprimé.'); // Ajout de journaux
    }
    res.render('login', {
        title: 'login',
        errorMessage: null 
    });
});



router.post('/login', async (req, res, next) =>{
  try {
    await service.authenticate(req, res);
  } catch (error) {
    return res.status(400).json({ message: 'Erreur lors de la connexion', error });
  }
});


module.exports = router;