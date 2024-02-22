const mongoose = require('mongoose');

const OffreSpecialeSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    idclient: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    contenu: String,
    date_heure_envoi: Date,
    mail_envoi: String
});

const Offrespeciale = mongoose.model('Offrespeciale', OffreSpecialeSchema);

function getAllOffres()
{
    return Offrespeciale.find({}).populate({
        path: 'idclient',
        select: 'email',
        match: { type_user: 'client' }
    }).exec();
}

module.exports = { Offrespeciale, getAllOffres };
