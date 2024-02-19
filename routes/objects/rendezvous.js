const mongoose = require('mongoose');

const RendezvousSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    date_heure: Date,
    service: String,
    client: String,
    employe: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    prixpaye: Number,
    comissionemploye: Number
});

const Rendezvous = mongoose.model('Rendezvous', RendezvousSchema);


function getAllRendezVous()
{
    return Rendezvous.find({ }).exec();
}

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

module.exports = { Rendezvous, getAllRendezVous , getHistoriqueRendezVous };
