const mongoose = require('mongoose');
const moment = require('moment');
const { Utilisateur } = require("./utilisateur");

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

function getRdvEmp(debutMois,finMois,date) {
    try {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return Rendezvous.find({
            etat_rdv: 0,
            $or: [
                {
                    date_heure: {
                        $gte: debutMois,
                        $lt: finMois
                    }
                },
                {
                    date_heure: {
                        $gte: new Date(formattedDate),
                        $lt: moment(formattedDate).add(1, 'days').toDate()
                    }
                }
            ]
        }).populate({
            path: 'employe',
            select: 'email',
            match: { type_user: 'employe' }
        }).exec();       
    } catch (error) {
        throw new Error('Une erreur s\'est roduite lors de la récupération des rendez-vous pour le mois en cours : ' + error.message);
    }
}


async function getTemps_moyen_travail(debutMois, finMois) {
    try {
        const rendezvous = await getRdvEmp(debutMois, finMois);
        const tempsTravailParEmploye = {};

        // Calculer la durée totale de travail et le nombre de rendez-vous pour chaque employé
        rendezvous.forEach(rdv => {
            // Vérifier si l'employé existe déjà dans l'objet tempsTravailParEmploye
            if (!tempsTravailParEmploye[rdv.employe.email]) {
                tempsTravailParEmploye[rdv.employe.email] = {
                    total_duree: 0,
                    nombre_rendezvous: 0
                };
            }
            // Ajouter la durée du rendez-vous à la durée totale de travail de l'employé
            tempsTravailParEmploye[rdv.employe.email].total_duree += rdv.duree;
            tempsTravailParEmploye[rdv.employe.email].nombre_rendezvous++;
        });

        // Récupérer tous les employés de la base de données
        const tousLesEmployes = await Utilisateur.find({ type_user: 'employe' });

        // Ajouter les employés absents dans l'objet tempsTravailParEmploye avec un temps moyen de 0
        tousLesEmployes.forEach(employe => {
            const email = employe.email;
            if (!tempsTravailParEmploye[email]) {
                tempsTravailParEmploye[email] = {
                    total_duree: 0,
                    nombre_rendezvous: 0
                };
            }
        });

        // Calculer le temps moyen de travail pour chaque employé
        const tempsMoyenParEmploye = {};
        for (const email in tempsTravailParEmploye) {
            const { total_duree, nombre_rendezvous } = tempsTravailParEmploye[email];
            tempsMoyenParEmploye[email] = nombre_rendezvous === 0 ? 0 : total_duree / nombre_rendezvous;
        }

        return tempsMoyenParEmploye;
    } catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul du temps moyen de travail pour le mois en cours : ' + error.message);
    }
}

function getConditionReservation(debutJourMois,finJourMois,date,etat)
{
    const queryConditions = { etat_rdv: etat };

    if (debutJourMois && finJourMois) {
         queryConditions.$or = [
            { date_heure: { $gte: debutJourMois, $lt: finJourMois } }
        ];
    }

    if (date) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const formattedNextDate = moment(formattedDate).add(1, 'days').toDate();
        queryConditions.$or = queryConditions.$or || [];
        queryConditions.$or.push({ date_heure: { $gte: new Date(formattedDate), $lt: formattedNextDate } });
    }
    return queryConditions;
}

async function getStatReservation(debutJourMois,finJourMois,date) {
    try {
        const PrisesConditions = getConditionReservation(debutJourMois,finJourMois,date,1);
        const NonPrisesConditions = getConditionReservation(debutJourMois,finJourMois,date,0);
        
        const prises = await Rendezvous.countDocuments(PrisesConditions);

        const nonPrises = await Rendezvous.countDocuments(NonPrisesConditions);

        const global = prises + nonPrises;

        return { prises, nonPrises, global };

    } catch (error) {
        console.error('Une erreur s\'est produite lors du calcul des statistiques de réservation :', error);
    }
}


module.exports = { Rendezvous, getHistoriqueRendezVous , getAllRendezVousEmp , getTaskDaily , getTemps_moyen_travail , getStatReservation };
