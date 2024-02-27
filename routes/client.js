var express = require('express');
var router = express.Router();
const { rappelEmail } = require("./helpers/mailSender");
const moment = require('moment');

const { Rendezvous , getHistoriqueRendezVous , getAllRendezVousEmp , controlRdv , getMontantRendezvous } = require("./objects/rendezvous");
const { Service , getCommissionService , getDuree , getCommission , getDescription } = require("./objects/service");
const { getAllClient , getEmploye , getUserEmail } = require("./objects/utilisateur");
const { getPourcentageOffre } = require("./objects/offrespeciale");
const { getTotal } = require("./objects/compte");

router.get('/', function(req, res, next) {
    getAllClient()
        .then(clients => {
            res.json(clients);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des clients.' });
        });
});


router.get('/rendezvous/historique/:id', function(req, res, next) {
    const idclient = req.params.id;
    getHistoriqueRendezVous(idclient)
        .then(rendezvous => {
            res.json(rendezvous);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération de l\'historique des rendez-vous.' });
        });
});

router.post('/rendezvous/add', async function(request, response, next) {
    try {
        const pourcentage = await getPourcentageOffre(request.body.idclient, request.body.idservice);
        const pourcentageOffre = (request.body.prixpaye * pourcentage) / 100; 
        const pourcentageFinal = Math.max(pourcentageOffre, 0);
        const prixPaye = Number(request.body.prixpaye) - Number(pourcentageFinal);
        const CommissionService = await getCommissionService(request.body.idservice,prixPaye);
        const dureeService = await getDuree(request.body.idservice);
        const comissionServicePourcentage = await getCommission(request.body.idservice);
        const momentDateHeure = moment.utc(request.body.date_heure);
        const date_heure = momentDateHeure.add(1, 'hour');
        date_heure.subtract(1, 'hour');
        let rendezvous = new Rendezvous({
             date_heure: date_heure,
             service: request.body.idservice,
             client: request.body.idclient,
             employe: request.body.idemploye,
             prixpaye: prixPaye,
             rappel: request.body.rappel,
             comissionemploye: CommissionService,
             duree: dureeService,
             comission: comissionServicePourcentage,
             etat_rdv:0,
             etat_valid:0
             });
        
             const total = await getTotal(request.body.idclient);
             const MontantTotalRdv = await getMontantRendezvous(request.body.idclient);
             const soldeClient = total - MontantTotalRdv;
    
             const result = await controlRdv(request.body.date_heure,dureeService,request.body.idemploye);
        
        if(result == 0)
       {
       rendezvous.save().then(() => {
         response.json({ message: 'Rendez vous added with success' , status: '200'});
         
         const rappelmomentDateHeure = moment.utc(request.body.date_heure);
         rappelmomentDateHeure.subtract(1, 'hour');
         const minutes_avant_envoi = rendezvous.rappel;
         const now = new Date();
         const temps_avant_envoi = new Date(rappelmomentDateHeure - minutes_avant_envoi * 60000);
                    
                if (now >= temps_avant_envoi) {
                    return;
                }
                
                getDescription(request.body.idservice)
                .then(description => {
                    getEmploye(request.body.idemploye)
                        .then(employeEmail => {
                            getUserEmail(request.body.idclient).then(userEmail => {
                                setTimeout(() => {
                                    rappelEmail(userEmail,date_heure, description, rendezvous.duree, employeEmail);
                                }, temps_avant_envoi - now);        
                            }).catch(error => console.error('An error occurred while getting email user: ', error));
                        })
                        .catch(error => console.error('An error occurred while getting employe: ', error));
                })
                .catch(error => console.error('An error occurred while getting description: ', error));
        })
       .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
       }
       else if(soldeClient < prixPaye)
       {
        response.json({ message: 'Solde insufisant.' , status: '400' })
       }
       else
        {
           response.json({ message: 'Cet employé est occupé à cette date et à cette heure.' , status: '400' })
       }
    } catch (error) {
        console.error('Une erreur s\'est produite: ', error);
        response.status(500).json({ message: 'Une erreur s\'est produite lors de l\'ajout du rendez-vous.' });
    }
});


module.exports = router;
