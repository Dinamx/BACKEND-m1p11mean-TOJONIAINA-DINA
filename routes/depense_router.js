var express = require('express');
var router = express.Router();

const { Depense , getAllDepenses } = require("./objects/depense");


router.get('/', function(req, res, next) {
    getAllDepenses().then(depenses => {
      res.json(depenses);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});

router.post('/add', function(request,response) {
    let service = new Depense({
        description: request.body.description,
        prix: request.body.prix,
        date_heure: request.body.date_heure,
    });
    service.save()
        .then(() => {
            response.json({ message: 'Depense added with success' , status: '200'});
        })
        .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
})

module.exports = router;
