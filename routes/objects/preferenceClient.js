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

function insertPreferenceClient(idClient, idService) {
    // Vérifie d'abord si une préférence avec ces identifiants existe déjà
    return Preference.findOne({
        client: idClient,
        service: idService
    }).then(preference => {
        // Si une préférence est trouvée, renvoie cette préférence
        if (preference) {
            return preference;
        }
        // Sinon, crée et sauvegarde une nouvelle préférence
        const newPreference = new Preference({
            client: idClient,
            service: idService
        });
        return newPreference.save();
    });
}


function deletePreferenceClient(idClient, idService) {
    // Utilisez le modèle Preference pour supprimer la préférence correspondante
    return Preference.findOneAndDelete({
        client: idClient,
        service: idService
    });
}




module.exports = { Preference, getPreferenceClient, insertPreferenceClient, deletePreferenceClient };