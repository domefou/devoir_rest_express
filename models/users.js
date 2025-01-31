const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
//bcrypt est un module qui permet de hasher les mots de passe.

//Schema est une classe qui permet de définir la structure des documents stockés dans une collection MongoDB.
const User = new Schema({
    name: {
        type : String,
        trim : true,
        required : [true, 'Le nom est obligatoire']
    },
    firstname: {
        type : String,
        trim : true,
    },
    email: {
        type : String,
        trim : true,
        required : [true, 'L\'email est obligatoire'],
        unique : true,
        lowercase : true
    },
    password: {
        type : String,
        trim : true,
        required : [true, 'Le mot de passe est obligatoire']
    },
},{
    //timestamps est un paramètre qui permet d'ajouter automatiquement les champs createdAt et updatedAt à un document.
    timestamps: true
});

User.pre('save', function(next) {
    //save() est une méthode qui permet de sauvegarder un document dans une collection
    //isModified() est une méthode qui permet de vérifier si un champ a été modifié.
    if (!this.isModified('password')) {
        return next();
    }

    this.password = bcrypt.hashSync(this.password, 10);
    //bcrypt.hashSync() est une méthode qui permet de hasher un mot de passe de manière synchrone.
    next();
});

module.exports = mongoose.model('User', User);