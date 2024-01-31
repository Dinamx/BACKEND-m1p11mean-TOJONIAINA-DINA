var express = require('express');
var router = express.Router();



const { Utilisateur, getAllUsers } = require("./objects/utilisateur");

/* GET home page. */
router.get('/', function(req, res, next) {

  getAllUsers().then(users => {
    console.log(users);
    res.json(users);
  }).catch(error => console.error('Une erreur s\'est produite lors de la récupération des utilisateurs: ', error));
  console.log('http://localhost:3000/')
  // res.render('index', { title: 'Express' });
});

module.exports = router;
