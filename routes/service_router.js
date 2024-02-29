var express = require('express');
var router = express.Router();

const { Service, getAllServices, getPrice } = require("./objects/service");

// avoir le prix suggeeree

router.get('/prix/:idclient/:idservice', function (req, res, next) {
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



router.get('/', function (req, res, next) {
    getAllServices().then(services => {
        res.json(services);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});

router.post('/add', function (request, response) {
    let service = new Service({
        description: request.body.nom,
        image: request.body.image,
        prix: request.body.prix,
        duree: request.body.duree,
        comission: request.body.commission
    });
    service.save()
        .then(() => {
            response.json({ message: 'Service added with success', status: '200' });
        })
        .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
})




router.put('/update/:idService', function (req, res) {
    const userId = req.params.idService;
    const { description, prix, duree, comission, image } = req.body;

    console.log(req.body);

    Service.findByIdAndUpdate(userId, { description, prix, duree, comission }, { new: true })
        .then(updatedService => {
            if (!updatedService) {
                console.log('Update service');
                return res.status(404).json({ message: "Service non trouvé" });
            }
            console.log('Updated');
            res.status(200).json({ message: 'Service mis à jour avec succès', user: updatedService });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur : ', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour de l\'utilisateur.' });
        });
});




module.exports = router;
