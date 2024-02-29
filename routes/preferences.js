var express = require('express');
var router = express.Router();
const { rappelEmail } = require("./helpers/mailSender");
const moment = require('moment');

const { Rendezvous, getHistoriqueRendezVous, getAllRendezVousEmp, controlRdv, getMontantRendezvous } = require("./objects/rendezvous");


// get idClient
router.get('/:idclient', function (req, res, next) {
    const idClient = req.params.idclient;
    getPreferenceClient(idClient)
        .then(preferences => {
            res.json(preferences);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des données.' });
        });
});



// post insertion 
router.post('/', function (req, res, next) {
    const idClient = req.body.idclient;
    const idService = req.body.idservice;
    insertPreferenceClient(idClient, idService)
        .then(preference => {
            res.json(preference);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'insertion des données.' });
        });
});



module.exports = router;
