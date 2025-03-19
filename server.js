// ...existing code...

const path = require('path');

// Middleware pour capturer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erreur interne du serveur');
});

// Servir des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Vérifiez que la route par défaut renvoie du contenu
app.get('/', (req, res) => {
    res.send('<h1>Bienvenue sur mon API Express</h1>');
});

// ...existing code...
