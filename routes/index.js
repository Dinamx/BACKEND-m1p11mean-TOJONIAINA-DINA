var express = require('express');
var router = express.Router();


const { Utilisateur, getAllUsers } = require("./objects/utilisateur");
const sendEmail = require("./helpers/mailSender");


/* GET home page. */
router.get('/', function(req, res, next) {
  getAllUsers().then(users => {
    console.log(users);
    res.json(users);
  }).catch(error => console.error('Une erreur s\'est produite lors de la récupération des utilisateurs: ', error));
  console.log('http://localhost:3000/')
  // res.render('index', { title: 'Express' });
});


router.get('/send', function(req, res, next) {
  console.log('Sending Email')
  var now = new Date();
  var targetDate = new Date('2024-01-31T17:00:00');
  var diffInMilliseconds = targetDate - now;

  setTimeout(function() {
    sendEmail('dinasly01@gmail.com', 'Ceci est un contenu test');
  }, diffInMilliseconds);

  res.send('Email will be sent at the specified date and time.');
});



module.exports = router;
