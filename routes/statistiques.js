var express = require('express');
var router = express.Router();
const moment = require('moment');

var { getTemps_moyen_travail } = require("./objects/rendezvous");

router.get('/temps_moyen_travail', function(req, res, next) {
    const date = new Date();
    const mois = date.getMonth() + 1; 
    const debutMois = new Date(date.getFullYear(), mois - 1, 1); 
    debutMois.setDate(debutMois.getDate() + 1); 
    const debutMoisSuivant = new Date(date.getFullYear(), mois, 1);
    const finMois = new Date(debutMoisSuivant.getTime() - 1);

    getTemps_moyen_travail(debutMois,finMois).then(durrees => {
        res.json(durrees);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});

module.exports = router;