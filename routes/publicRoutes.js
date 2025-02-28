const express = require('express');
const router = express.Router();
const service = require ('../services/users');
const User = require('../models/users');


//routes page accueil
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

//routes inscription
/*
  router.get('/signup', async (req, res) => {
    if (req.cookies.token) { // Vérifiez si un jeton JWT est présent
      console.log('Jeton présent, suppression du jeton.'); // Ajout de journaux
      res.clearCookie('token'); // Supprimez le jeton JWT
      console.log('Jeton supprimé.'); // Ajout de journaux
  }
    res.render('signup', {
      title: 'signup'
    });
  });
*/

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


//suppression du token lors du retour au page non securisé

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


// route rapport d'erreur ou incident
router.use((err, req, res, next) => {
  res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: err });
});

module.exports = router;

