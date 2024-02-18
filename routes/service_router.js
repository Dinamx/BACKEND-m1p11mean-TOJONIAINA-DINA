var express = require('express');
var router = express.Router();

const { getAllServices } = require("./objects/service");


router.get('/', function(req, res, next) {
    getAllServices().then(services => {
      res.json(services);
    }).catch(error => console.error('Une erreur s\'est produite', error));
});


module.exports = router;
