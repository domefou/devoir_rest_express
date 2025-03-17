/**
 * Modèle Mongoose pour les utilisateurs.
 * @module models/user
 * @requires mongoose
 * @requires bcrypt
 * 
 * @description
 * Ce modèle définit la structure des documents `User` stockés dans une collection MongoDB.
 * Chaque document représente un utilisateur avec des champs obligatoires comme le nom, l'email, 
 * le mot de passe, une question secrète et une réponse secrète. Les mots de passe et les réponses 
 * sont hashés avant d'être sauvegardés dans la base de données pour garantir la sécurité.
 * Le modèle utilise également les timestamps pour inclure automatiquement les champs `createdAt` et `updatedAt`.
 * 
 * @property {String} name - Nom de l'utilisateur (obligatoire).
 * @property {String} firstname - Prénom de l'utilisateur (facultatif).
 * @property {String} email - Adresse email unique de l'utilisateur (obligatoire).
 * @property {String} password - Mot de passe hashé de l'utilisateur (obligatoire, min. 8 caractères).
 * @property {String} role - Rôle de l'utilisateur (valeurs possibles : 'user', 'admin', par défaut : 'user').
 * @property {String} question - Question secrète de l'utilisateur (obligatoire).
 * @property {String} response - Réponse secrète hashée de l'utilisateur (obligatoire).
 * @property {Date} createdAt - Date de création du document (ajoutée automatiquement par Mongoose).
 * @property {Date} updatedAt - Date de la dernière mise à jour du document (ajoutée automatiquement par Mongoose).
 * 
 * @pre
 * Avant de sauvegarder un document, les champs `password` et `response` sont automatiquement hashés
 * à l'aide de bcrypt si ces champs ont été modifiés.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
//bcrypt est un module qui permet de hasher les mots de passe.

//Schema est une classe qui permet de définir la structure des documents stockés dans une collection MongoDB.
const User = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Le nom est obligatoire']
    },
    firstname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'L\'email est obligatoire'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Le mot de passe est obligatoire'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    question: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    }
}, {
    //timestamps est un paramètre qui permet d'ajouter automatiquement les champs createdAt et updatedAt à un document.
    timestamps: true
});

User.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        if (this.isModified('response')) {
            this.response = await bcrypt.hash(this.response, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', User);