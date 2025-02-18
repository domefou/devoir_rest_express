const mongoose = require('mongoose');
const Schema = mongoose.Schema
//Schema est une classe qui permet de définir la structure des documents stockés dans une collection MongoDB.
const Catways = new Schema({
    catwaysNumber: {
        type : Number,
        trim : true,
        required : [true, 'champ requis'],
    },
    catwaysType: {
        type : String,
        trim : true,
        required : [true, 'champ requis'],
    },
    catwaysState: {
        type : String,
        trim : true,
        required : [true, 'champ requis'],
    },
},
{
    //timestamps est un paramètre qui permet d'ajouter automatiquement les champs createdAt et updatedAt à un document.
    timestamps: true
});


module.exports = mongoose.model('catways', Catways);