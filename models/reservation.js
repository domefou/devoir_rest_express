const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
//bcrypt est un module qui permet de hasher les mots de passe.

//Schema est une classe qui permet de définir la structure des documents stockés dans une collection MongoDB.
const Reservation = new Schema({
    catwayNumber: {
        type : Number,
        trim : true,
        required : [true, 'champ requis'],
    },
    clientName: {
        type : String,
        trim : true,
        required : [true, 'champ requis'],
    },
    boatName: {
        type : String,
        trim : true,
        required : [true, 'champ requis'],
    },
    
    startDate: {
        type : Date,
        trim : true,
        required : [true, 'champ requis'],
    },
    endDate: {
        type : Date,
        trim : true,
        required : [true, 'champ requis'],
    },
},
{
    //timestamps est un paramètre qui permet d'ajouter automatiquement les champs createdAt et updatedAt à un document.
    timestamps: true
});

Reservation.pre('save', function(next) {
    //bcrypt.hashSync() est une méthode qui permet de hasher un mot de passe de manière synchrone.
    next();
});

module.exports = mongoose.model('Reservation', Reservation);