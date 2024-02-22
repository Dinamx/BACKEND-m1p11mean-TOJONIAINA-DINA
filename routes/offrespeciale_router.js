var express = require('express');
var router = express.Router();

const { Offrespeciale , getAllOffres } = require("./objects/offrespeciale");

router.get('/', function(req, res, next) {
    getAllOffres().then(offres => {
      res.json(offres);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});

router.post('/add', function(request,response) {
    let offrespeciale = new Offrespeciale({
        idclient: request.body.idclient,
        contenu: request.body.contenu,
        date_heure_envoi: request.body.date_heure_envoi,
        mail_envoi: request.body.mail_envoi
    });
    offrespeciale.save()
        .then(() => {
            response.json({ message: 'Offrespeciale added with success' , status: '200'});
        })
        .catch(error => console.error('An error occurred while saving an offrespeciale: ', error));
})

module.exports = router;
