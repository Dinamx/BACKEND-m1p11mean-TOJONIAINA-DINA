var express = require('express');
var router = express.Router();

const { Rendezvous , getHistoriqueRendezVous , getAllRendezVousEmp } = require("./objects/rendezvous");
const { getAllEmploye } = require("./objects/utilisateur");


router.get('/rendezvous/:emp_id', function(req, res, next) {
  const empId = req.params.emp_id;

  getAllRendezVousEmp(empId)
      .then(rendezvous => {
          res.json(rendezvous);
      })
      .catch(error => {
          console.error('Une erreur s\'est produite', error);
          res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération de l\'historique des rendez-vous.' });
      });
});

router.get('/', function(req, res, next) {
    getAllEmploye().then(employes => {
      res.json(employes);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});




module.exports = router;
