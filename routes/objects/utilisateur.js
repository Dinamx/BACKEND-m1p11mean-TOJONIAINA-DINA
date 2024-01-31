const mongoose = require('mongoose');

const UtilisateurSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    email: String,
    password: String,
    type_user: { type: String, enum: ['client', 'manager', 'employe'] }
});

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);


function getAllUsers() {
    return Utilisateur.find({}).exec();
}

//Client Manager Employe

function getTypeUser(){

}

module.exports = Utilisateur;
module.exports = { Utilisateur, getAllUsers };