const express = require('express');
const router = express.Router();

// Route de déconnexion
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Supprime le cookie contenant le jeton JWT
    res.redirect('/login'); // Redirige vers la page de connexion
});

module.exports = router;