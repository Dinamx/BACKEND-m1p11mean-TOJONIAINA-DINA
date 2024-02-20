var express = require('express');
var router = express.Router();
const moment = require('moment');

var { getTemps_moyen_travail , getStatReservation } = require("./objects/rendezvous");

router.post('/search_reservation', function(req, res, next) {
    const date = new Date();
    const date_search = req.body.date;
    const mois = req.body.mois; 
    const debutJourMois = new Date(date.getFullYear(), mois - 1, 1); 
    debutJourMois.setDate(debutJourMois.getDate() + 1); 
    const debutJourMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finJourMois = new Date(debutJourMoisSuivant.getTime() - 1);

    getStatReservation(debutJourMois,finJourMois,date_search).then(reservations => {
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
        
    getStatReservation(debutJourMois,finJourMois,null).then(reservations => {
        res.json(reservations);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});

router.post('/search_temps_moyen_travail', function(req, res, next) {
    const date = new Date();
    const date_search = req.body.date;
    const mois = req.body.mois; 
    const debutMois = new Date(date.getFullYear(), mois - 1, 1); 
    debutMois.setDate(debutMois.getDate() + 1); 
    const debutMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finMois = new Date(debutMoisSuivant.getTime() - 1);

    getTemps_moyen_travail(debutMois,finMois,mois).then(durrees => {
        res.json(durrees);
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
 
    getTemps_moyen_travail(debutMois,finMois,null).then(durrees => {
        res.json(durrees);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});

module.exports = router;
