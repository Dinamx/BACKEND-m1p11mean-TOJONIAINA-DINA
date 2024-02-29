var express = require('express');
var router = express.Router();

const { Depense, getAllDepenses, getDepensesByMonth } = require("./objects/depense");


router.get('/', function (req, res, next) {
    getAllDepenses().then(depenses => {
        res.json(depenses);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});

router.get('/:mois', function (req, res, next) {

    // J'ai besoin d'avoir les depense du mois , inspire toi de 

});



router.post('/add', function (request, response) {
    let service = new Depense({
        description: request.body.description,
        prix: request.body.prix,
        date_heure: request.body.date_heure,
    });
    console.log(request.body);
    service.save()
        .then(() => {
            response.json({ message: 'Depense added with success', status: '200' });
        })
        .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
});


router.get('/:mois/:annee', function (req, res, next) {
    const { mois, annee } = req.params;
    getDepensesByMonth(mois, annee)
        .then(depenses => {
            console.log('depense pour le mois demande ' + depenses);
            res.json(depenses);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des dépenses' });
        });
});

module.exports = router;
