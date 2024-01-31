const mongoose = require('mongoose');

const UtilisateurSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    email: String,
    password: String,
    type_user: String
});

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);

module.exports = Utilisateur;