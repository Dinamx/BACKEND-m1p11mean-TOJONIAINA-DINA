var express = require('express');
var router = express.Router();
const { Compte, getTotal, getCompteReelClient} = require("./objects/compte"); // Assurez-vous que le chemin d'importation est correct


router.get('',function (){
    console.log('UYo');
})
// Route pour créer un nouveau compte
router.post('/create', function(req, res, next) {
    const { montant, idClient } = req.body;
    const newCompte = new Compte({ montant, idClient });

    console.log('Create')

    newCompte.save()
        .then(() => {
            res.status(201).json({ message: 'Compte créé avec succès.' });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la création du compte : ', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la création du compte.' });
        });
});

// Route pour obtenir le total des comptes pour un client spécifique
router.get('/total/:idClient', async function(req, res, next) {
    const idClient = req.params.idClient;
    try {
        const total = await getCompteReelClient(idClient);
        res.json({ total });
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du total : ', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération du total.' });
    }
});

// Route pour mettre à jour un compte existant
router.put('/update/:id', function(req, res, next) {
    const compteId = req.params.id;
    const { montant } = req.body;

    Compte.updateOne({ _id: compteId }, { montant })
        .then(() => {
            res.status(200).json({ message: 'Compte mis à jour avec succès.' });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la mise à jour du compte : ', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour du compte.' });
        });
});

// Route pour supprimer un compte
router.delete('/delete/:id', function(req, res, next) {
    const compteId = req.params.id;

    Compte.deleteOne({ _id: compteId })
        .then(() => {
            res.status(200).json({ message: 'Compte supprimé avec succès.' });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la suppression du compte : ', error);
            res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression du compte.' });
        });
});

module.exports = router;