const mongoose = require('mongoose');
const moment = require('moment');

const RendezvousSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    date_heure: Date,
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    client: String,
    employe: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    prixpaye: Number,
    comissionemploye: Number,
    duree: Number,
    comission: {type: Number, min: 0, max: 100 },
    etat_rdv: { type: Number, enum: [0,1] }
});

const Rendezvous = mongoose.model('Rendezvous', RendezvousSchema);



function getHistoriqueRendezVous(idclient)
{
    return Rendezvous.find({ client: idclient }).populate({
        path: 'employe',
        select: 'email',
        match: { type_user: 'employe' }
    })
    .exec();
}

function getAllRendezVousEmp(id_employe) {
    if (id_employe) {
        return Rendezvous.find({ employe: id_employe }).populate({
            path: 'employe',
            select: 'email',
            match: { type_user: 'employe' }
        })
        .exec();
    } else {
        return Rendezvous.find({}).exec();
    }
}

function getTaskDaily(id_employe,currentDate) {
    const formattedCurrentDate = moment(currentDate).format('YYYY-MM-DD');
    return Rendezvous.find({ 
        employe: id_employe, 
        date_heure: { 
            $gte: new Date(formattedCurrentDate), 
            $lt: moment(formattedCurrentDate).add(1, 'days').toDate() 
        } 
    })
    .populate({
        path: 'service',
        select: 'description'
    })
    .exec();
}

module.exports = { Rendezvous, getHistoriqueRendezVous , getAllRendezVousEmp , getTaskDaily };
