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
    console.log("Yoo")
    let utilisateur = new Utilisateur({
        email: 'example@email.com',
        password: 'password',
        type_user: 'admin'
    });
    utilisateur.save()
        .then(() => {
            console.log('SIGNUP , Done Be ')
            res.json({ message: 'Signup request received' });
        })
        .catch(error => console.error('An error occurred while saving the utilisateur: ', error));
    // console.log('SIGNUP , Done Be ')
    // res.json({ message: 'Signup request received' });
});


module.exports = router;
