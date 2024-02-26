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
    const idemploye = request.body.idemploye;
    const heureDebut = request.body.heureDebut;
    const heureFin = request.body.heureFin;

    findByIdemploye(idemploye).then(existingHoraire => {
        if (existingHoraire) {
            // Si l'horaire existe déjà, mettez à jour
            updateHoraire(existingHoraire._id, heureDebut, heureFin)
                .then(() => {
                    response.json({ message: 'Horaire updated with success', status: '200' });
                })
                .catch(error => console.error('An error occurred while updating the horaire: ', error));
        } else {
            // Si l'horaire n'existe pas, insérez-le
            insertHoraire(idemploye, heureDebut, heureFin)
                .then(() => {
                    response.json({ message: 'Horaire added with success', status: '200' });
                })
                .catch(error => console.error('An error occurred while saving the horaire: ', error));
        }
    }).catch(error => console.error('An error occurred while finding the horaire: ', error));
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