var express = require('express');
var router = express.Router();

const { Offrespeciale , getAllOffres , getPourcentageOffre } = require("./objects/offrespeciale");
const { sendEmail } = require("./helpers/mailSender");

router.get('/', function(req, res, next) {
    getAllOffres().then(offres => {
      res.json(offres);
    }).catch(error => console.error('Une erreur s\'est produites', error));
});

router.post('/add', function(request, response) {
  
  sendEmail(request.body.mail_envoi, request.body.date_heure_envoi, request.body.contenu, request.body.pourcentage);
      
  let offrespeciale = new Offrespeciale({
      idclient: request.body.idclient,
      contenu: request.body.contenu,
      date_heure_envoi: request.body.date_heure_envoi,
      mail_envoi: request.body.mail_envoi,
      pourcentage: request.body.pourcentage,
      date_fin: request.body.date_fin,
      idservice: request.body.idservice
  });

  offrespeciale.save()
      .then(() => {
          response.status(201).json({ message: 'Offrespeciale added with success', status: '200' });
      })
      .catch(error => {
          console.error('An error occurred while saving an offrespeciale: ', error);
          response.status(500).json({ error: 'An error occurred while saving an offrespeciale' });
      });
});


module.exports = router;
