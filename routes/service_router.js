var express = require('express');
var router = express.Router();

const { Service , getAllServices } = require("./objects/service");


router.get('/', function(req, res, next) {
    getAllServices().then(services => {
      res.json(services);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});

router.post('/add', function(request,response) {
    let service = new Service({
        description: request.body.nom,
        image: request.body.image,
        prix: request.body.prix,
        durée: request.body.duree,
        comission: request.body.commission
    });
    service.save()
        .then(() => {
            response.json({ message: 'Service added with success' , status: '200'});
        })
        .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
})

module.exports = router;
