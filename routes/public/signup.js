const express = require('express');
const router = express.Router();
const service = require ('../../services/users');

router.get('/signup', async (req, res) => {
    try {
        if (req.cookies.token) { // Vérifiez si un jeton JWT est présent
            console.log('Jeton présent, suppression du jeton.'); // Ajout de journaux
            res.clearCookie('token'); // Supprimez le jeton JWT
            console.log('Jeton supprimé.'); // Ajout de journaux
        }
        console.log('Rendu de la vue signup'); // Ajout de journaux
        res.render('signup', {
            title: 'signup',
            errorMessage: null // Assurez-vous que errorMessage est défini si nécessaire
        });
    } catch (error) {
        console.error('Erreur lors du rendu de la vue signup:', error);
        res.status(500).json({ message: "Erreur lors du rendu de la vue signup", error });
    }
});



//redirection a page login apres inscription
router.post('/signup',service.add, async (req, res) => {
  const { password } = req.body;
  if (password.length < 8) {
    res.render('signup', {
      errorMessage: null  });
}
      return res.redirect('/login'); // Redirection vers la page de connexion après une inscription réussie
  });

  module.exports = router;