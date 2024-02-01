var express = require('express');
const Utilisateur = require("./objects/utilisateur");
var router = express.Router();

/* GET home page. */
router.post('/login', function(req, res, next) {
    console.log('LOGIN , here lays the code for traitement ')
    // res.render('index', { title: 'Express' });
});


router.get('/signup', function(req, res, next) {
    // Ici, vous pouvez ajouter le code pour traiter la demande d'inscription.
    console.log("Signup and shit")
    // let utilisateur = new Utilisateur({
    //     email: 'example2@email.com',
    //     password: 'password',
    //     type_user: 'admin'
    // });
    // utilisateur.save()
    //     .then(() => {
    //         console.log('SIGNUP , Done Be ')
    //         res.json({ message: 'Signup request received' });
    //     })
    //     .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
    // console.log('SIGNUP , Done Be ')
    // res.json({ message: 'Signup request received' });
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

router.post('/users', function(req, res, next) {
    const { email, password } = req.body;
    Utilisateur.findOne({ email, password })
        .then(user => {
            if (user) {
                res.json(user.type_user);
            } else {
                res.status(404).send('User not found');
            }
        })
        .catch(error => console.error('Une erreur s\'est produite lors de la recherche de l\'utilisateur: ', error));
});





//Maintenant fais moi un /Users qui me retourne la liste des users

module.exports = router;
