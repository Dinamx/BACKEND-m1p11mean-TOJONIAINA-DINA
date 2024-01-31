const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    description: String,
    prix: Number,
    durée: { type: Number, min: 0 },
    comission: { type: Number, min: 0, max: 100 }
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;
