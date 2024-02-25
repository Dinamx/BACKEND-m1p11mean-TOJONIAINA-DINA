const mongoose = require('mongoose');
const { Utilisateur } = require("./utilisateur");

const ServiceSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    description: String,
    image: String,
    prix: Number,
    durée: { type: Number, min: 0 },
    comission: { type: Number, min: 0, max: 100 }
});

const Service = mongoose.model('Service', ServiceSchema);


function getAllServices()
{
    return Service.find({}).exec();
}

async function getCommission(idService) {
    try {
        const service = await Service.findById(idService).exec();
        if (!service) {
            throw new Error('Service non trouvé');
        }
        return service.comission; 
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de la commission du service: ', error);
        throw error; 
    }
}

async function getCommissionService(idservice, prix_paye) {
    try {
        const commission = await getCommission(idservice);    
        const result = (prix_paye * commission)/100;
        console.log(result);
        return result;
    } catch (error) {
        console.error('Une erreur s\'est produite: ', error);
        throw error;
    }
}

async function getDuree(idservice){
    try {
        const service = await Service.findById(idservice).exec();
        if (!service) {
            throw new Error('Service non trouvé');
        }
        return service.durée; 
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération de la durree du service: ', error);
        throw error; 
    }
}

async function getDescription(idService) {
    try {
        const service = await Service.findById(idService).exec();
        return service.description; 
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du service: ', error);
        throw error; 
    }
}


module.exports = Service;
module.exports = { Service,getAllServices,getCommissionService,getDuree,getCommission,getDescription};
