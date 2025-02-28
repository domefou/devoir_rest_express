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
        required : [true, 'Le mot de passe est obligatoire'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
    },
    role: {
        type : String,
        enum : ['user','admin'],
        default : 'user'
    },
    question: { 
        type: String,
        required: true
     },
    response: { 
        type: String,
        required: true 
    }
},{
    //timestamps est un paramètre qui permet d'ajouter automatiquement les champs createdAt et updatedAt à un document.
    timestamps: true
});

User.pre('save', async function(next) {
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