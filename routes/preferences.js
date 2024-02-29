var express = require('express');
var router = express.Router();
const { rappelEmail } = require("./helpers/mailSender");
const moment = require('moment');


const { Preference, getPreferenceClient, insertPreferenceClient, deletePreferenceClient } = require("./objects/preferenceClient");


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
    const idClient = req.body.client;
    const idService = req.body.service;
    insertPreferenceClient(idClient, idService)
        .then(preference => {
            res.json(preference);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'insertion des données.' });
        });
});

router.post('/delete', function (req, res, next) {
    console.log('delete end');
    const idClient = req.body.client;
    const idService = req.body.service;
    deletePreferenceClient(idClient, idService)
        .then(preference => {
            if (!preference) {
                return res.status(404).json({ message: 'Pas de préférence trouvée avec ces identifiants.' });
            }
            res.json({ message: 'Préférence supprimée avec succès.' });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression des données.' });
        });
});



module.exports = router;
