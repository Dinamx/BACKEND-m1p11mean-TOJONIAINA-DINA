const mongoose = require('mongoose');
const { getTotalCommission } = require("./rendezvous");

const DepenseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    description: String,
    prix :  { type: Number, min: 0 },
    date_heure: Date
});

const Depense = mongoose.model('Depense', DepenseSchema);

function getAllDepenses()
{
    return Depense.find({}).exec();
}

async function getTotalDepense(debutJourMois, finJourMois,anneeCourante) {
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

async function getStatDepense(debutJourMois, finJourMois,anneeCourante) {
    try {
        const TotalDepense = await getTotalDepense(debutJourMois,finJourMois,anneeCourante);
        const TotalCommission = await getTotalCommission(debutJourMois,finJourMois,anneeCourante);
        const depenseGlobale = TotalDepense + TotalCommission;
        return depenseGlobale;
    } catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul du chiffre d\'Affaire : ' + error.message);
    }
}



module.exports = { Depense,getAllDepenses,getTotalDepense , getStatDepense};