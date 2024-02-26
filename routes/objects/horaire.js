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


module.exports = { Horaire,getAllHoraires};