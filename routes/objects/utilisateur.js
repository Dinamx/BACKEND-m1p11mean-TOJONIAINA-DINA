const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


const UtilisateurSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    image: { type: String, default: '/assets/images/profile/profile.png' }, //
    nom: { type: String, default: 'Personne ' }, //
    email: String,
    password: String,
    type_user: { type: String, enum: ['client', 'manager', 'employe'] }
});

const Utilisateur = mongoose.model('Utilisateur', UtilisateurSchema);


function getAllUsers() {
    return Utilisateur.find({}).exec();
}


function getAllEmploye() {
    return Utilisateur.find({ type_user: 'employe' }).exec();
}


function getAllClient() {
    return Utilisateur.find({ type_user: 'client' }).exec();
}

//Client Manager Employe

async function getUser(email, password) {
    try {
        const user = await Utilisateur.findOne({ email, password, type_user: 'admin' }).exec();

        if (!user) {
            throw new Error('Utilisateur admin non trouvé');
        }

        return user;
    } catch (error) {
        throw new Error('Erreur lors de la recherche de l\'utilisateur admin');
    }
}

async function getEmploye(id) {
    try {
        const utilisateur = await Utilisateur.findOne({ _id: id, type_user: 'employe' }).exec();
        return utilisateur ? utilisateur.email : null;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de l\'utilisateur: ', error);
        throw error;
    }
}


async function getUserEmail(id) {
    try {
        const utilisateur = await Utilisateur.findOne({ _id: id, type_user: 'client' }).exec();
        return utilisateur ? utilisateur.email : null;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de l\'utilisateur: ', error);
        throw error;
    }
}

module.exports = Utilisateur;
module.exports = { Utilisateur, getAllUsers, getAllEmploye, getAllClient, getEmploye, getUserEmail };