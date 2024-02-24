const mongoose = require('mongoose');
const moment = require('moment');

const OffreSpecialeSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    idclient: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    contenu: String,
    date_heure_envoi: Date,
    mail_envoi: String,
    pourcentage: Number,
    date_fin: Date,
    idservice: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
});

const Offrespeciale = mongoose.model('Offrespeciale', OffreSpecialeSchema);

function getAllOffres()
{
    return Offrespeciale.find({}).populate([{
        path: 'idclient',
        select: 'email',
        match: { type_user: 'client' }
    },{
        path: 'idservice',
        select: 'description'
    }]).exec();
}

async function getPourcentageOffre(idclient, idservice) {
    try {
        const currentDate = moment();
        const offre = await Offrespeciale.findOne({ idclient: idclient, idservice: idservice })
                                .sort({ date_heure_envoi: -1 })
                                .limit(1);

        if (!offre) {
            return 0; 
        }

        const dateHeureEnvoi = moment(offre.date_heure_envoi);
        const dateFin = moment(offre.date_fin);

        if (currentDate.isBetween(dateHeureEnvoi, dateFin)) {
            return offre.pourcentage; // Si la date actuelle est dans l'intervalle de validité de l'offre, retourner le pourcentage
        } else {
            return 0; 
        }
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la recherche de l\'offre spéciale : ', error);
        return 0; 
    }
}

module.exports = { Offrespeciale, getAllOffres , getPourcentageOffre };
