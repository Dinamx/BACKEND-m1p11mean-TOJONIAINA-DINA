const mongoose = require('mongoose');

const DepenseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    description: String,
    prix :  { type: Number, min: 0 },
    date_heure: Date
});

const Depense = mongoose.model('Depense', DepenseSchema);

function getAllDepenses()
{
    return Depense.find({}).exec();
}

module.exports = { Depense,getAllDepenses};