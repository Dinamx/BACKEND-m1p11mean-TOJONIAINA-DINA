const mongoose = require('mongoose');
const { getMontantRendezvous } = require("./rendezvous"); // Assurez-vous que le chemin d'importation est correct

const CompteSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    montant: { type: Number, required: true },
    idClient: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true }
});

const Compte = mongoose.model('Compte', CompteSchema);



async function getTotal(idClient) {
    try {
        const comptes = await Compte.find({ idClient: idClient }).exec();
        if (!comptes || comptes.length ===  0) {
            // throw new Error('Aucun compte trouvé pour cet idClient');
            return 0;
        }
        const total = comptes.reduce((acc, compte) => acc + compte.montant,  0);
        return total;
    } catch (error) {
        alert('TEST ALERT DANS COMPTE.JS LIGNE 24');
        console.error('Une erreur s\'est produite lors de la récupération du total: ', error);
        throw error;
    }
}


async function getCompteReelClient(idClient) {
    try {
        // Obtenir le total des montants des comptes du client
        const totalComptes = await getTotal(idClient);

        // Obtenir le montant total des rendez-vous validés du client
        const montantRendezvous = await getMontantRendezvous(idClient);

        // Calculer la différence entre le total des comptes et le montant total des rendez-vous
        const compteReelClient = totalComptes - montantRendezvous;

        return compteReelClient;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du compte réel du client : ', error);
        throw error;
    }
}

module.exports = { Compte, getTotal  , getCompteReelClient };