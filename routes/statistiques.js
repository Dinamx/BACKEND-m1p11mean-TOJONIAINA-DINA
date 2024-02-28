var express = require('express');
var router = express.Router();
const moment = require('moment');

var { getTemps_moyen_travail , getStatReservation , getChiffreAffaire , getStatBenefice } = require("./objects/rendezvous");

router.get('/benefice/:mois/:annee', function(req, res, next) {
    const annee = req.params.annee;
    const mois = req.params.mois; 
    const date = new Date();
    const debutJourMois = new Date(date.getFullYear(), mois - 1, 1); 
    debutJourMois.setDate(debutJourMois.getDate() + 1); 
    const debutJourMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finJourMois = new Date(debutJourMoisSuivant.getTime() - 1);

    getStatBenefice(debutJourMois,finJourMois,annee).then(benefices => {
        res.json(benefices);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});



router.get('/benefice', function(req, res, next) {
    const date = new Date();
    const mois = date.getMonth() + 1; 
    const debutJourMois = new Date(date.getFullYear(), mois - 1, 1); 

    debutJourMois.setDate(debutJourMois.getDate() + 1); 
    const debutJourMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finJourMois = new Date(debutJourMoisSuivant.getTime() - 1);
    const anneeCourante = new Date().getFullYear();    
    getStatBenefice(debutJourMois,finJourMois,anneeCourante).then(chiffreAffaires => {
        res.json(chiffreAffaires);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});


router.get('/chiffre_affaire/:mois/:annee', function(req, res, next) {
    const annee = req.params.annee;
    const mois = req.params.mois; 
    const date = new Date();
    const debutJourMois = new Date(date.getFullYear(), mois - 1, 1); 
    debutJourMois.setDate(debutJourMois.getDate() + 1); 
    const debutJourMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finJourMois = new Date(debutJourMoisSuivant.getTime() - 1);

    getChiffreAffaire(debutJourMois,finJourMois,annee).then(reservations => {
        res.json(reservations);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});


router.get('/chiffre_affaire', function(req, res, next) {
    const date = new Date();
    const mois = date.getMonth() + 1; 
    const debutJourMois = new Date(date.getFullYear(), mois - 1, 1); 

    debutJourMois.setDate(debutJourMois.getDate() + 1); 
    const debutJourMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finJourMois = new Date(debutJourMoisSuivant.getTime() - 1);
    const anneeCourante = new Date().getFullYear();    
    getChiffreAffaire(debutJourMois,finJourMois,anneeCourante).then(chiffreAffaires => {
        res.json(chiffreAffaires);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});

router.post('/reservation/:mois', function(req, res, next) {
    const date = new Date();
    const mois = req.params.mois; 
    const debutJourMois = new Date(date.getFullYear(), mois - 1, 1); 
    debutJourMois.setDate(debutJourMois.getDate() + 1); 
    const debutJourMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finJourMois = new Date(debutJourMoisSuivant.getTime() - 1);

    getStatReservation(debutJourMois,finJourMois).then(reservations => {
        res.json(reservations);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});

router.get('/reservation', function(req, res, next) {
    const currentDate = moment().format('YYYY-MM-DD');
    const date = new Date();

    const mois = date.getMonth() + 1; 

    const debutJourMois = new Date(date.getFullYear(), mois - 1, 1); 

    debutJourMois.setDate(debutJourMois.getDate() + 1); 
    const debutJourMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finJourMois = new Date(debutJourMoisSuivant.getTime() - 1);
        
    getStatReservation(debutJourMois,finJourMois).then(reservations => {
        res.json(reservations);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});

router.get('/temps_moyen_travail/:mois', function(req, res, next) {
    const date = new Date();
    const mois = req.params.mois; 
    const debutMois = new Date(date.getFullYear(), mois - 1, 1); 
    debutMois.setDate(debutMois.getDate() + 1); 
    const debutMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finMois = new Date(debutMoisSuivant.getTime() - 1);

    getTemps_moyen_travail(debutMois, finMois).then(durrees => {
        const donneesReformatees = Object.entries(durrees).map(([nom, temps]) => ({
            nom,
            temps
        }));
        res.json(donneesReformatees);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});

router.get('/temps_moyen_travail', function(req, res, next) {
    const date = new Date();
    const mois = date.getMonth() + 1; 
    const debutMois = new Date(date.getFullYear(), mois - 1, 1); 
    debutMois.setDate(debutMois.getDate() + 1); 
    const debutMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finMois = new Date(debutMoisSuivant.getTime() - 1);
    const currentDate = moment().format('YYYY-MM-DD');
 
    getTemps_moyen_travail(debutMois, finMois).then(durrees => {
        const donneesReformatees = Object.entries(durrees).map(([nom, temps]) => ({
            nom,
            temps
        }));
        res.json(donneesReformatees);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});

module.exports = router;
