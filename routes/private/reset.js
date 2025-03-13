const express = require('express');
const router = express.Router();
const service = require('../../services/users');

// Route de déconnexion
router.get('/reset', (req, res) => {
    res.clearCookie('token'); // Supprime le cookie contenant le jeton JWT
    res.render('reset', {
        title: 'reset',
        errorMessage: null 
    });// Redirige vers la page de connexion
});

router.put('/reset', async (req, res) => {
    try {
      await service.passwordUpdate(req, res);
      console.log('mise a jour du mot de passe reussi');
    } catch (error) {
      console.error('METHOD PUT passwordUpdate = erreur lors de l\'utilisation de la méthode', error);
    }
  });


module.exports = router;

