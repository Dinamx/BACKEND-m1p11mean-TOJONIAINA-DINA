const mongoose = require('mongoose');

const DepenseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    description: String,
    prix: { type: Number, min: 0 },
    date_heure: Date
});

const Depense = mongoose.model('Depense', DepenseSchema);

function getAllDepenses() {
    return Depense.find({}).exec();
}

async function getDepensesByMonth(mois, annee) {
    // Convertir le mois en format numérique (1 pour janvier, 2 pour février, etc.)
    try {
        const month = parseInt(mois, 10);
        // Créer les dates de début et de fin pour le mois spécifié
        const debutMois = new Date(annee, month - 1, 1);
        // const finMois = new Date(annee, month, 0);
        const finMois = new Date(annee, parseInt(mois, 10), 0);
        const finMoisPlusUnJour = new Date(finMois.getTime());
        finMoisPlusUnJour.setDate(finMoisPlusUnJour.getDate() + 1);

        return Depense.find({
            date_heure: {
                $gte: debutMois,
                $lt: finMoisPlusUnJour
            }
        }).exec();
    } catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul du chiffre d\'Affaire : ' + error.message);
    }
}

async function getTotalDepense(debutJourMois, finJourMois, anneeCourante) {
    try {
        const total_depense = await Depense.aggregate([
            {
                $match: {
                    date_heure: {
                        $gte: debutJourMois,
                        $lt: finJourMois
                    }
                }
            },
            {
                $addFields: {
                    annee: { $dateToString: { format: "%Y", date: "$date_heure" } }
                }
            },
            {
                $match: {
                    annee: anneeCourante.toString()
                }
            },
            {
                $group: {
                    _id: null,
                    total_depense: { $sum: '$prix' }
                }
            }
        ]);

        if (total_depense.length > 0) {
            return total_depense[0].total_depense;
        } else {
            return 0;
        }
    } catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul du chiffre d\'Affaire : ' + error.message);
    }
}


module.exports = { Depense, getAllDepenses, getTotalDepense, getDepensesByMonth };