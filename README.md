# devoir_rest_express

API privée pour les utilisateurs et les administrateurs destinée à la gestion des réservations de catways au port de plaisance de Russell. Cette application web permet :
- **Pour les utilisateurs** : Réserver un catway en ligne.
- **Pour les administrateurs** : Gérer les catways, les réservations et l'état des catways.

## Description
Le port de plaisance de Russell a exprimé le besoin d'une solution moderne pour gérer les réservations de catways, de petits appontements pour amarrer les bateaux. Cette application comprend :
- Une **API privée** permettant une interaction sécurisée entre le frontend et le backend.
- Une interface simple pour gérer les réservations et afficher les informations.

## Fonctionnalités
### Utilisateur
- Réservation de catways en ligne.
- Affichage des réservations existantes.

### Administrateur
- Gestion complète des catways (ajout, modification, suppression).
- Gestion des réservations (création, modification, annulation).
- Suivi de l'état des catways.

## Installation et démarrage

### Pré-requis
- **Node.js** : Version 16 ou supérieure.
- **MongoDB** : Une base de données MongoDB fonctionnelle.

### Étapes d'installation
1. **Clonez le repository :**
   ```bash
   git clone <URL_DU_REPOSITORY>
   cd devoir_rest_express

installer node
-- npm install --


Créez un fichier .env dans le dossier env/ :

DATABASE_URL=<URL_DE_LA_BASE_DE_DONNÉES>
PORT=3000
JWT_SECRET=<votre_secret_jwt>
SESSION_SECRET=<votre_secret_session>

Utilisez la commande suivante pour démarrer le serveur avec nodemon :
-- npm start --



Voici les principales bibliothèques utilisées dans ce projet, selon le fichier package.json :

bcrypt : Pour le hachage sécurisé des mots de passe.
cookie-parser : Analyse les cookies HTTP.
cors : Gère les requêtes cross-origin.
dotenv : Charge les variables d'environnement à partir d'un fichier .env.
ejs : Moteur de templates.
env-cmd : Chargeur avancé de variables d'environnement.
express : Framework pour construire des applications web et API.
express-session : Gère les sessions utilisateur.
jsonwebtoken : Génère et vérifie les JSON Web Tokens (JWT).
method-override : Permet l'utilisation de verbes HTTP tels que PUT et DELETE.
mongodb et mongoose : Modélisation et gestion des données MongoDB.
morgan : Middleware pour le logging des requêtes HTTP.
nodemon : Redémarre automatiquement le serveur lors de modifications.


Endpoints de l'API

Publique
POST /login : se connecter.

POST /signUp : s'inscrire.

POST /reset : reinitialiser le mot de passe.

Utilisateur
POST /reservations : Créer une réservation.

GET /reservations : Récupérer toutes les réservations.

Administrateur
POST /catways : Ajouter un nouveau catway.

PUT /catways/:id : Mettre à jour les informations d'un catway.

DELETE /catways/:id : Supprimer un catway.

GET /catways : Récupérer l'état des catways.


Les scripts disponibles dans ce projet sont définis dans le package.json :
Démarrage du serveur :
-- npm start --


Contribution
Les contributions sont les bienvenues ! Suivez les étapes ci-dessous :

Forkez ce repository.

Créez une branche spécifique pour vos modifications :

bash
git checkout -b feature/ma-fonctionnalite
Effectuez vos modifications et poussez-les :

bash
git push origin feature/ma-fonctionnalite
Soumettez une Pull Request.

Licence
Ce projet est sous la licence MIT. Consultez le fichier LICENSE pour plus d'informations.