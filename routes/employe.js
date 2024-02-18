var express = require('express');
var router = express.Router();

const { getAllEmploye } = require("./objects/utilisateur");


router.get('/', function(req, res, next) {
    getAllEmploye().then(employes => {
      res.json(employes);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});


module.exports = router;
