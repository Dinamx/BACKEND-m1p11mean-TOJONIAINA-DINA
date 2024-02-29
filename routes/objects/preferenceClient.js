const mongoose = require('mongoose');

const PreferenceClientSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
});

const Preference = mongoose.model('PreferenceClient', PreferenceClientSchema);

function getAllPreference() {
    return Preference.find({}).exec();
}


//  getPreferenceClient
function getPreferenceClient(idClient) {
    return Preference.find({ client: idClient }).exec();
}

//  InsertionPreferenceClient
function insertPreferenceClient(idClient, idService) {
    const newPreference = new Preference({
        client: idClient,
        service: idService
    });

    return newPreference.save();
}







module.exports = { Preference, getAllPreferenceClient, insertPreferenceClient };