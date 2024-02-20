var express = require('express');
var router = express.Router();
const moment = require('moment');

const { Rendezvous , getHistoriqueRendezVous , getAllRendezVousEmp , getTaskDaily } = require("./objects/rendezvous");
const { getAllEmploye } = require("./objects/utilisateur");


router.post('/search_task_daily', function(req, res, next) {
    const empId = req.body.emp_id;
    const currentDate = req.body.date;
    getTaskDaily(empId,currentDate).then(tasks => {
        res.json(tasks);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});


router.get('/task_daily/:emp_id', function(req, res, next) {
    const empId = req.params.emp_id;
    const currentDate = moment().format('YYYY-MM-DD');
    getTaskDaily(empId,currentDate).then(tasks => {
        res.json(tasks);
    })
    .catch(error => {
        console.error('Une erreur s\'est produite', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des donnees.' });
    });
});

  
router.put('/update_rdv/:id', function(req, res, next) {
    const rdvId = req.params.id;
    Rendezvous.updateOne({ _id: rdvId }, { prixpaye : req.body.prixpaye , duree : req.body.duree })
        .then(() => {
            res.status(200).json({ message: 'Modification avec succès.' });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la mise à jour du rendez-vous : ', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour du rendez-vous.' });
        });
});


router.put('/terminer_rendez_vous/:id', function(req, res, next) {
    const rdvId = req.params.id;

    Rendezvous.updateOne({ _id: rdvId }, { etat_rdv: 1 })
        .then(() => {
            res.status(200).json({ message: 'Rendez-vous terminé avec succès.' });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la mise à jour du rendez-vous : ', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour du rendez-vous.' });
        });
});

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
