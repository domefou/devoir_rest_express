const express = require('express');
const router = express.Router();
const service = require('../services/users');
const User = require('../models/users');

// Route de déconnexion
router.get('/reset', (req, res) => {
    res.clearCookie('token'); // Supprime le cookie contenant le jeton JWT
    res.render('reset', {
        title: 'reset',
        errorMessage: null 
    });// Redirige vers la page de connexion
});

router.post('/reset', async(req, res, next) =>{
    const email = req.body.email;
    const user = await User.findOne({email: email});
    try{
        await service.passwordUpdate (req, res, next)
        // Redirigez vers /login après la mise à jour du mot de passe
        console.log(user);
        return res.redirect('/login');
    } catch (error) {
        // Gérer les erreurs et rediriger si nécessaire
        console.error('Erreur lors de la mise à jour du mot de passe :', error);
        return res.status(500).json({ message: 'Erreur du serveur interne', erreur: error });
    }

});



module.exports = router;

