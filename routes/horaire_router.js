var express = require('express');
var router = express.Router();

const { Horaire , getAllHoraires } = require("./objects/horaire");


router.get('/', function(req, res, next) {
    getAllHoraires().then(horaires => {
      res.json(horaires);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});

router.post('/add', function(request,response) {
    let horaire = new Horaire({
        idemploye: request.body.idemploye,
        heureDebut: request.body.heureDebut,
        heureFin: request.body.heureFin
    });
    horaire.save()
        .then(() => {
            response.json({ message: 'Horaire added with success' , status: '200'});
        })
        .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
})

module.exports = router;
