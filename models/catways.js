/**
 * Modèle Mongoose pour les catways.
 * @module models/catways
 * @requires mongoose
 * 
 * @description
 * Ce modèle définit la structure des documents `catways` stockés dans une collection MongoDB.
 * Chaque document représente un catway avec des propriétés telles que son identifiant, son numéro, son type, et son état.
 * Le modèle utilise également les timestamps pour inclure automatiquement les champs `createdAt` et `updatedAt`.
 * 
 * @property {String} catwaysId - Identifiant du catway (facultatif).
 * @property {Number} catwaysNumber - Numéro unique du catway (obligatoire).
 * @property {String} catwaysType - Type du catway (obligatoire).
 * @property {String} catwaysState - État du catway (obligatoire).
 * @property {Date} createdAt - Date de création du document (ajoutée automatiquement par Mongoose).
 * @property {Date} updatedAt - Date de la dernière mise à jour du document (ajoutée automatiquement par Mongoose).
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema
//Schema est une classe qui permet de définir la structure des documents stockés dans une collection MongoDB.
const Catways = new Schema({
    catwaysId: {
        type: String,
        trim: true,
        required: [false, 'pas obligatoire'],
    },
    catwaysNumber: {
        type: Number,
        unique: true,
        trim: true,
        required: [true, 'champ requis'],
    },
    catwaysType: {
        type: String,
        trim: true,
        required: [true, 'champ requis'],
    },
    catwaysState: {
        type: String,
        trim: true,
        required: [true, 'champ requis'],
    },
},
    {
        //timestamps est un paramètre qui permet d'ajouter automatiquement les champs createdAt et updatedAt à un document.
        timestamps: true
    });


module.exports = mongoose.model('catways', Catways);