const express = require('express');
const router = express.Router();
const service = require ('../services/users');


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


//redirection a page login apres inscription
router.post('/signup',service.add, async (req, res) => {
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

//redirection en fonction du role
router.post('/login', service.authenticate, (req, res) => {
  if (!req.session.user) {
    req.session.user = {
        name: req.decoded.user.name,
        email: req.decoded.user.email
    };
}
  let role = req.decoded.user.role;
    if(role === "admin"){
      res.redirect('/admin/menu');
    }
    else{
      res.redirect('/user/menu');
    }});

// route rapport d'erreur ou incident
router.use((err, req, res, next) => {
  res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: err });
});

module.exports = router;