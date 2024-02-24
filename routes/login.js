var express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var router = express.Router();
const crypto = require('crypto');


const { Utilisateur, getAllUsers } = require("./objects/utilisateur");


router.post('/login', function(req, res, next) {
    console.log('LOGIN, here lays the code for traitement');
    
    const email = req.body.email;
    const password = req.body.password;

    // Rechercher l'utilisateur dans la base de données
    Utilisateur.findOne({ email: email, password: password })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Login failed: Email ou mot de passe incorrect.' });
            }
            const token = jwt.sign({ email: user.email }, 'apkmean', { expiresIn: '7d' });
            res.status(200).json({ message: 'Login successful.', userId: user._id , token: token });
        })
        .catch(error => {
            console.error('An error occurred while logging in: ', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
        });
});


router.post('/signup', function(request, response) {
    const { email, password, type_user } = request.body;
    
    let utilisateur = new Utilisateur({
        email: email,
        password: password,
        type_user: type_user
    });

    utilisateur.save()
        .then(() => {
            console.log('SIGNUP , Done Be ');
            const token = jwt.sign({ email: utilisateur.email }, 'apkmean', { expiresIn: '7d' });
            response.json({ message: 'Signup request received', userId: utilisateur._id, token: token });
        })
        .catch(error => {
            console.error('An error occurred while saving the utilisateur: ', error);
            response.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
        });
});


router.get('/users', function(req, res, next) {
    Utilisateur.find({})
        .then(users => {
            console.log('yo')
            console.log(users)
            res.json(users);
        })
        .catch(error => console.error('Une erreur s\'est produite lors de la récupération des utilisateurs: ', error));
});


//Maintenant fais moi un /Users qui me retourne la liste des users

module.exports = router;
