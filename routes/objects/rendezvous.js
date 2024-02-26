const mongoose = require('mongoose');
const moment = require('moment');
const { Utilisateur } = require("./utilisateur");
var { getTotalDepense } = require("./depense");
const { Horaire, getAllHoraires } = require("./horaire");

const { getCompteReelClient } = require("./compte");


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
    comission: { type: Number, min: 0, max: 100 },
    etat_rdv: { type: Number, enum: [0, 1] },
    etat_valid: { type: Number, enum: [0, 1] }
});

const Rendezvous = mongoose.model('Rendezvous', RendezvousSchema);



function getHistoriqueRendezVous(idclient) {
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

function getTaskDaily(id_employe, currentDate) {
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

function getRdvEmp(debutMois, finMois, date) {
    try {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return Rendezvous.find({
            etat_rdv: 1,
            etat_valid: 1,
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

async function getChiffreAffaire(debutJourMois, finJourMois, anneeCourante) {
    try {
        const totalPrixPaye = await Rendezvous.aggregate([
            {
                $match: {
                    etat_rdv: 1,
                    etat_valid: 1,
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

async function getTotalCommission(debutJourMois, finJourMois, anneeCourante) {
    try {
        const total_commission = await Rendezvous.aggregate([
            {
                $match: {
                    etat_rdv: 1,
                    etat_valid: 1,
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

async function getStatBenefice(debutJourMois, finJourMois, anneeCourante) {
    try {
        const chiffre_affaire = await getChiffreAffaire(debutJourMois, finJourMois, anneeCourante);
        const Totaldepense = await getTotalDepense(debutJourMois, finJourMois, anneeCourante);
        const TotalCommission = await getTotalCommission(debutJourMois, finJourMois, anneeCourante);
        const depense = Totaldepense + TotalCommission;
        const benefice = chiffre_affaire - depense;
        return benefice;
    }
    catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul du chiffre d\'Affaire : ' + error.message);
    }
}

// recuperer la date fin par rapport a la date du rdv et la duree
async function getDateFin(date_heure, duree) {
    try {
        // Conversion de la date_heure en objet Date
        const dateFin = new Date(date_heure);
        // Ajout de la durée en minutes à la date de début
        const minutes = dateFin.getMinutes() + duree;
        dateFin.setMinutes(minutes);
        // Ajout d'une heure à la date de début
        dateFin.setHours(dateFin.getHours() + 1);
        if (dateFin.getHours() >= 24) {
            dateFin.setDate(dateFin.getDate() + 1);
            dateFin.setHours(dateFin.getHours() % 24);
        }
        return dateFin;
    } catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul de la date de fin : ' + error.message);
    }
}

// Get Total payé par client
async function getMontantRendezvous(idClient) {
    try {
        const montantTotal = await Rendezvous.aggregate([
            {
                $match: {
                    client: new mongoose.Types.ObjectId(idClient),
                    etat_rdv:  1
                }
            },
            {
                $group: {
                    _id: null,
                    montantTotal: { $sum: "$prixpaye" }
                }
            }
        ]);

        // Si aucun rendez-vous n'est trouvé, retourner  0
        if (montantTotal.length ===  0) {
            return  0;
        }

        // Retourner le montant total des rendez-vous
        return montantTotal[0].montantTotal;
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du montant total des rendez-vous : ', error);
        throw error;
    }
}


// ato fonction manao control rendez vous mi retourne 0 (libre) , 1 (occupe) 
async function controlRdv(date_h, duree, idemploye) {
    try {
        const dateFinRdv = await getDateFin(date_h, duree);
        const dateFinRdvMoment = moment(dateFinRdv);
        dateFinRdvMoment.subtract(1, 'hour');
        const heureFin = dateFinRdvMoment.format('HH:mm');

        const date_heure = moment.utc(date_h).toDate();

        const momentDateHeure = moment(date_heure);
        momentDateHeure.subtract(1, 'hour');
        const heureDebut = momentDateHeure.format('HH:mm');

        const rendezvousEmploye = await Rendezvous.find({
            employe: idemploye,
            etat_rdv: 0
        });

        const horaireEmploye = await Horaire.findOne({ idemploye: idemploye });

        const heureDebutTravailEmp = horaireEmploye.heureDebut;

        const heureFinTravailEmp = horaireEmploye.heureFin;
       
        // check horaire of emp
        if (heureDebut >= heureDebutTravailEmp && heureFin <= heureFinTravailEmp) { }
        else {
            return 1;
        }

        // check disponibilty of emp
        for (const rdv of rendezvousEmploye) {
            const dateDebutRdvEmp = rdv.date_heure;
            const dateFinRdvEm = await getDateFin(rdv.date_heure, rdv.duree);
            const dateFinRdvEmp = new Date(dateFinRdvEm);
            dateFinRdvEmp.setHours(dateFinRdvEmp.getHours() - 1);

            if ((dateDebutRdvEmp.getTime() <= new Date(date_heure).getTime() && dateFinRdvEmp.getTime() >= dateFinRdv.getTime()) || (dateDebutRdvEmp.getTime() == new Date(date_heure).getTime() && dateFinRdvEmp.getTime() >= dateFinRdv.getTime()) || (dateDebutRdvEmp.getTime() <= new Date(date_heure).getTime() && dateFinRdvEmp.getTime() == new Date(date_heure).getTime()) || (dateDebutRdvEmp.getTime() == new Date(date_heure).getTime() && dateFinRdvEmp.getTime() == dateFinRdv.getTime()) || (dateDebutRdvEmp.getTime() >= new Date(date_heure).getTime() && dateFinRdvEmp.getTime() >= dateFinRdv.getTime())) {
                return 1;
            }
        }
        return 0;  //employe libre 
    } catch (error) {
        throw new Error('Une erreur s\'est produite lors du calcul de la date de fin : ' + error.message);
    }
}

module.exports = { Rendezvous, getHistoriqueRendezVous, getAllRendezVousEmp, getTaskDaily, getTemps_moyen_travail, getStatReservation, getChiffreAffaire, getTotalCommission, getStatBenefice, getMontantRendezvous , controlRdv };

