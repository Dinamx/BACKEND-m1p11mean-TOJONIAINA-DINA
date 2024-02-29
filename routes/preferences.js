var express = require('express');
var router = express.Router();
const { rappelEmail } = require("./helpers/mailSender");
const moment = require('moment');

const { Rendezvous, getHistoriqueRendezVous, getAllRendezVousEmp, controlRdv, getMontantRendezvous } = require("./objects/rendezvous");


// get idClient
router.get('/:idclient', function (req, res, next) {
    const idclient = req.params.idclient;
    const idservice = req.params.idservice;
    getPrice(idclient, idservice).then(prix => {
        res.json(prix);
    })
        .catch(error => {
            console.error('Une erreur s\'est produite', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
        });
});

// post insertion 
router.get('/', function (req, res, next) {
    const idclient = req.params.idclient;
    const idservice = req.params.idservice;
    getPrice(idclient, idservice).then(prix => {
        res.json(prix);
    })
        .catch(error => {
            console.error('Une erreur s\'est produite', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
        });
});



module.exports = router;
