const mongoose = require('mongoose');

const OffreSpecialeSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    contenu: String,
    date_heure_envoi: Date,
    mail_envoi : String
});

const Offrespeciale = mongoose.model('Offrespeciale', OffreSpecialeSchema);



module.exports = Offrespeciale;