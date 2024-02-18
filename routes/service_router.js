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
        description: request.body.description,
        prix: request.body.prix,
        durée: request.body.durée,
        comission: request.body.comission
    });
    service.save()
        .then(() => {
            response.json({ message: 'Service added with success' , status: '200'});
        })
        .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
})

module.exports = router;
