var express = require('express');
var router = express.Router();

const { Rendezvous , getHistoriqueRendezVous , getAllRendezVousEmp } = require("./objects/rendezvous");
const { Service , getCommissionService , getDuree , getCommission } = require("./objects/service");


router.get('/rendezvous/historique', function(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Token non fourni.' });
    }

    getHistoriqueRendezVous(token)
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
        const token = request.headers.authorization;
        if (!token) {
            return response.status(401).json({ message: 'Token non fourni.' });
        }
        const CommissionService = await getCommissionService(request.body.idservice, request.body.prixpaye);
        const dureeService = await getDuree(request.body.idservice);
        const comissionServicePourcentage = await getCommission(request.body.idservice);

        let rendezvous = new Rendezvous({
             date_heure: request.body.date_heure,
             service: request.body.idservice,
             client: token,
             employe: request.body.idemploye,
             prixpaye: request.body.prixpaye,
             comissionemploye: CommissionService,
             duree: dureeService,
             comission: comissionServicePourcentage,
             etat_rdv:0
             });
    
        rendezvous.save().then(() => {
            response.json({ message: 'Rendez vous added with success' , status: '200'});
        })
        .catch(error => console.error('An error occurred while saving the utilisateur: ', error));

    } catch (error) {
        console.error('Une erreur s\'est produite: ', error);
        response.status(500).json({ message: 'Une erreur s\'est produite lors de l\'ajout du rendez-vous.' });
    }
});


module.exports = router;
