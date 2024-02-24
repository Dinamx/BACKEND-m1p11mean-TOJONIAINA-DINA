const mongoose = require('mongoose');
const moment = require('moment');
const { Utilisateur } = require("./utilisateur");
var { getTotalDepense  } = require("./depense");

const RendezvousSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    date_heure: Date,
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    employe: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' },
    prixpaye: Number,
    rappel: Number,
    comissionemploye: Number,
    duree: Number,
    comission: {type: Number, min: 0, max: 100 },
    etat_rdv: { type: Number, enum: [0,1] }
});

const Rendezvous = mongoose.model('Rendezvous', RendezvousSchema);



function getHistoriqueRendezVous(idclient)
{
    return Rendezvous.find({ client: idclient }).populate([
        {
            path: 'employe',
            select: 'email',
            match: { type_user: 'employe' }
        },
        {
            path: 'client',
            select: { email: 'email' },
            match: { type_user: 'client' }
        }
    ]).exec();
}

function getAllRendezVousEmp(id_employe) {
    if (id_employe) {
        return Rendezvous.find({ employe: id_employe }).populate([{
            path: 'employe',
            select: 'email',
            match: { type_user: 'employe' }
        },
        {
            path: 'client',
            select: { email: 'email' },
            match: { type_user: 'client' }
        }])
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
    .populate([{
        path: 'service',
        select: 'description'
    },
    {
        path: 'client',
        select: { email: 'email' },
        match: { type_user: 'client' }
    }])
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
        }).populate([{
            path: 'employe',
            select: 'email',
            match: { type_user: 'employe' }
        },
        {
            path: 'client',
            select: { email: 'email' },
            match: { type_user: 'client' }
        }]).exec();       
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

async function getStatReservation(debutJourMois, finJourMois) {
    try {
        // Initialiser un tableau pour stocker les résultats
        const result = [];

        // Créer un objet pour stocker les dates avec leur nombre de réservations
        const reservationsParDate = {};

        // Obtenir toutes les réservations pour le mois en cours
        const reservations = await Rendezvous.find({ 
            date_heure: { $gte: debutJourMois, $lt: finJourMois } 
        });

        // Compter le nombre de réservations pour chaque date
        reservations.forEach(reservation => {
            const dateString = reservation.date_heure.toISOString().split('T')[0];
            reservationsParDate[dateString] = (reservationsParDate[dateString] || 0) + 1;
        });

        // Parcourir toutes les dates du mois et ajouter le nombre de réservations à chaque date
        let currentDate = new Date(debutJourMois);
        const endDate = new Date(finJourMois);
        while (currentDate < endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            const totalReservations = reservationsParDate[dateString] || 0;
            result.push({ date: dateString, reservations: totalReservations });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return result;
    } catch (error) {
        console.error('Une erreur s\'est produite lors du calcul des statistiques de réservation :', error);
    }
}

async function getChiffreAffaire(debutJourMois, finJourMois,anneeCourante) {
    try {
        const totalPrixPaye = await Rendezvous.aggregate([
            {
                $match: { 
                    etat_rdv: 1, 
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
                    total_prixpaye: { $sum: '$prixpaye' }
                }
            }
        ]);

        if (totalPrixPaye.length > 0) {
            return totalPrixPaye[0].total_prixpaye;
        } else {
            return 0; 
        }
    } catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul du chiffre d\'Affaire : ' + error.message);
    }
}

async function getTotalCommission(debutJourMois, finJourMois,anneeCourante) {
    try {
        const total_commission = await Rendezvous.aggregate([
            {
                $match: { 
                    etat_rdv: 1, 
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
                    total_commission: { $sum: '$comissionemploye' }
                }
            }
        ]);

        if (total_commission.length > 0) {
            return total_commission[0].total_commission;
        } else {
            return 0; 
        }
    } catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul du chiffre d\'Affaire : ' + error.message);
    }
}


async function getStatBenefice(debutJourMois, finJourMois,anneeCourante) {
    try {
    const chiffre_affaire = await getChiffreAffaire(debutJourMois,finJourMois,anneeCourante);
    const Totaldepense = await getTotalDepense(debutJourMois,finJourMois,anneeCourante);
    const TotalCommission = await getTotalCommission(debutJourMois,finJourMois,anneeCourante);
    const depense = Totaldepense + TotalCommission;
    const benefice = chiffre_affaire - depense;
    return benefice;
    } 
    catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul du chiffre d\'Affaire : ' + error.message);
    }
}


module.exports = { Rendezvous, getHistoriqueRendezVous , getAllRendezVousEmp , getTaskDaily , getTemps_moyen_travail , getStatReservation , getChiffreAffaire , getTotalCommission , getStatBenefice };
