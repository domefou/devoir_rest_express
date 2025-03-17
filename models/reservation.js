/**
 * Modèle Mongoose pour les réservations.
 * @module models/reservations
 * @requires mongoose
 * 
 * @description
 * Ce modèle définit la structure des documents `reservations` stockés dans une collection MongoDB.
 * Chaque document représente une réservation associée à un catway, un client et une période spécifique.
 * Le modèle utilise également les timestamps pour inclure automatiquement les champs `createdAt` et `updatedAt`.
 * 
 * @property {Number} catwaysNumber - Numéro du catway associé à la réservation (obligatoire).
 * @property {String} clientName - Nom du client ayant effectué la réservation (obligatoire).
 * @property {String} boatName - Nom du bateau pour lequel la réservation est effectuée (obligatoire).
 * @property {Date} startDate - Date de début de la réservation (obligatoire).
 * @property {Date} endDate - Date de fin de la réservation (obligatoire).
 * @property {Date} createdAt - Date de création du document (ajoutée automatiquement par Mongoose).
 * @property {Date} updatedAt - Date de dernière mise à jour du document (ajoutée automatiquement par Mongoose).
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//bcrypt est un module qui permet de hasher les mots de passe.

//Schema est une classe qui permet de définir la structure des documents stockés dans une collection MongoDB.
const Reservations = new Schema({
    catwaysNumber: {
        type: Number,
        trim: true,
        required: [true, 'champ requis'],
    },
    clientName: {
        type: String,
        trim: true,
        required: [true, 'champ requis'],
    },
    boatName: {
        type: String,
        trim: true,
        required: [true, 'champ requis'],
    },

    startDate: {
        type: Date,
        trim: true,
        required: [true, 'champ requis'],
    },
    endDate: {
        type: Date,
        trim: true,
        required: [true, 'champ requis'],
    },
},
    {
        //timestamps est un paramètre qui permet d'ajouter automatiquement les champs createdAt et updatedAt à un document.
        timestamps: true
    });

Reservations.pre('save', function (next) {
    //bcrypt.hashSync() est une méthode qui permet de hasher un mot de passe de manière synchrone.
    next();
});

module.exports = mongoose.model('Reservations', Reservations);