const mongoose = require('mongoose');

const RendezvousSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    date_heure: Date,
    service: String,
    client: String,
    employe: String,
    prixpaye: Number,
    comissionemploye: Number
});

const Rendezvous = mongoose.model('Rendezvous', RendezvousSchema);

function getAllRendezVous()
{
    return Rendezvous.find({}).exec();
}

function getAllRendezVous(id_employe) {
    if (id_employe) {
        return Rendezvous.find({ employe: id_employe }).exec();
    } else {
        return Rendezvous.find({}).exec();
    }
}

module.exports = { Rendezvous, getAllRendezVous };
