const mongoose = require('mongoose');

const CompteSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    montant: { type: Number, required: true },
    idClient: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true }
});

const Compte = mongoose.model('Compte', CompteSchema);

module.exports = Compte;


async function getTotal(idClient) {
    try {
        const comptes = await Compte.find({ idClient: idClient }).exec();
        if (!comptes || comptes.length ===  0) {
            throw new Error('Aucun compte trouvé pour cet idClient');
        }
        const total = comptes.reduce((acc, compte) => acc + compte.montant,  0);
        return total;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du total: ', error);
        throw error;
    }
}

module.exports = { Compte, getTotal };