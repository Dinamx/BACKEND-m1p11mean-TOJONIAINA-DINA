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
            const token = jwt.sign({ email: user.email }, 'apkmean', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful.', token: token });
        })
        .catch(error => {
            console.error('An error occurred while logging in: ', error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.' });
        });
});


router.post('/signup', function(request,response) {
    // Ici, vous pouvez ajouter le code pour traiter la demande d'inscription.
    console.log("Yoo")
    let utilisateur = new Utilisateur({
        email: request.body.email,
        password: request.body.password,
        type_user: request.body.type_user
    });
    utilisateur.save()
        .then(() => {
            console.log('SIGNUP , Done Be ')
            const token = jwt.sign({ email: utilisateur.email }, 'apkmean', { expiresIn: '1h' });
            // Envoyer le token dans la réponse
            response.json({ message: 'Signup request received', token: token });
        })
        .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
    console.log("Signup and shit")
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


//Forme du json a envoyer
// {
//     "email": "example2email.com",
//     "password": "password"
// }

// router.post('/users', function(req, res, next) {
//     const { email, password } = req.body;
//     Utilisateur.findOne({ email, password })
//         .then(user => {
//             if (user) {
//                 res.json(user.type_user);
//             } else {
//                 res.status(404).send('User not found');
//             }
//         })
//         .catch(error => console.error('Une erreur s\'est produite lors de la recherche de l\'utilisateur: ', error));
// });

router.get('/users', function(req, res, next) {
    getAllUsers().then(users => {
      res.json(users);
    }).catch(error => console.error('Une erreur s\'est produite lors de la récupération des utilisateurs: ', error));
});
  


//Maintenant fais moi un /Users qui me retourne la liste des users

module.exports = router;
