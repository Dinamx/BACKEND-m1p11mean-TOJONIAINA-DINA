const mongoose = require('mongoose');

const HoraireSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    idemploye: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    heureDebut: String,
    heureFin: String
});

const Horaire = mongoose.model('Horaire', HoraireSchema);

function getAllHoraires()
{
    return Horaire.find({}).exec();
}

// Fonction pour trouver un horaire par idemploye
function findByIdemploye(idemploye) {
    return Horaire.findOne({ idemploye: idemploye }).exec();
}

// Fonction pour mettre à jour un horaire existant
function updateHoraire(id, heureDebut, heureFin) {
    return Horaire.findByIdAndUpdate(id, { heureDebut: heureDebut, heureFin: heureFin }, { new: true }).exec();
}

// Fonction pour insérer un nouvel horaire
function insertHoraire(idemploye, heureDebut, heureFin) {
    let horaire = new Horaire({
        idemploye: idemploye,
        heureDebut: heureDebut,
        heureFin: heureFin
    });
    return horaire.save();
}

function findOrCreateHoraire(idemploye) {
    return findByIdemploye(idemploye).then(existingHoraire => {
        if (existingHoraire) {
            // Si l'horaire existe déjà, retourne-le
            return existingHoraire;
        } else {
            // Si l'horaire n'existe pas, crée-le avec des horaires par défaut
            return insertHoraire(idemploye, '08:00', '17:00');
        }
    });
}



module.exports = { Horaire, getAllHoraires, findByIdemploye, updateHoraire, insertHoraire, findOrCreateHoraire };

