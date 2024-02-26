var express = require('express');
var router = express.Router();

const { Horaire, getAllHoraires, findByIdemploye, updateHoraire, insertHoraire , findOrCreateHoraire } = require("./objects/horaire");

// Route pour récupérer tous les horaires
router.get('/', function(req, res, next) {
    getAllHoraires().then(horaires => {
        res.json(horaires);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});

// Route pour ajouter ou mettre à jour un horaire
router.post('/add', function(request, response) {
    const idemploye = request.body.idEmploye;
    const heureDebut = request.body.heureDebut;
    const heureFin = request.body.heureFin;

    console.log(request.body);

    findByIdemploye(idemploye).then(existingHoraire => {
        if (existingHoraire) {
            // Si l'horaire existe déjà, mettez à jour
            updateHoraire(existingHoraire._id, heureDebut, heureFin)
                .then(updatedHoraire => {
                    response.json({ message: 'Horaire updated with success', status: '200', horaire: updatedHoraire });
                })
                .catch(error => {
                    console.error('An error occurred while updating the horaire: ', error);
                    response.status(500).json({ message: 'An error occurred while updating the horaire', error: error });
                });
        } else {
            // Si l'horaire n'existe pas, insérez-le
            insertHoraire(idemploye, heureDebut, heureFin)
                .then(newHoraire => {
                    response.json({ message: 'Horaire added with success', status: '200', horaire: newHoraire });
                })
                .catch(error => {
                    console.error('An error occurred while saving the horaire: ', error);
                    response.status(500).json({ message: 'An error occurred while saving the horaire', error: error });
                });
        }
    }).catch(error => {
        console.error('An error occurred while finding the horaire: ', error);
        response.status(500).json({ message: 'An error occurred while finding the horaire', error: error });
    });
});

router.get('/:idEmploye', function(req, res, next) {
    const idemploye = req.params.idEmploye;

    findOrCreateHoraire(idemploye).then(horaire => {
        res.json(horaire);
    }).catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite', error: error });
    });
});

module.exports = router;